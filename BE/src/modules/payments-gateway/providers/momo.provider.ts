import { Injectable, Logger } from '@nestjs/common';
import { CreatePaymentInput, CreatePaymentResult, PaymentProvider, VerifyResult } from './payment-provider.interface';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import axios from 'axios';

@Injectable()
export class MomoProvider implements PaymentProvider {
  constructor(private readonly config: ConfigService) { }
  getName(): 'momo' {
    return 'momo';
  }

  private cfg() {
    const base = this.config.get('payments') as any;
    return base.momo;
  }

  private sign(raw: string, secretKey: string) {
    return crypto.createHmac('sha256', secretKey).update(raw).digest('hex');
  }

  async createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
    const { endpoint, partnerCode, accessKey, secretKey, redirectUrl, ipnUrl } = this.cfg();
    const requestType = 'payWithMethod';
    const amount = String(input.amount);
    const orderId = `${input.orderNumber}-${Date.now()}`;         // dùng orderNumber để dễ đối soát
    const requestId = `${orderId}-${Date.now()}`;
    const orderInfo = input.description || `Pay ${orderId}`;
    const autoCapture = true;
    const extraData = '';
    const lang = 'vi';

    const { EventId, ShowId } = input;

    const successUrl = `${redirectUrl}?eventId=${EventId}&showId=${ShowId}&orderCode=${input.orderNumber}&status=success`;
    const failUrl = `${redirectUrl}?eventId=${EventId}&showId=${ShowId}&orderCode=${input.orderNumber}&status=fail`;
    const redirectUrlWithParams = successUrl;

    const rawSignature =
      `accessKey=${accessKey}` +
      `&amount=${amount}` +
      `&extraData=${extraData}` +
      `&ipnUrl=${encodeURI(ipnUrl)}` +
      `&orderId=${orderId}` +
      `&orderInfo=${orderInfo}` +
      `&partnerCode=${partnerCode}` +
      `&redirectUrl=${redirectUrlWithParams}` +
      `&requestId=${requestId}` +
      `&requestType=${requestType}`;


    const signature = this.sign(rawSignature, secretKey);

    const reqBody = {
      partnerCode,
      partnerName: 'TicketBox',
      storeId: 'TicketBoxStore',
      requestId,
      amount,
      orderId,
      orderInfo,
      redirectUrl: redirectUrlWithParams,
      ipnUrl,
      lang,
      requestType,
      autoCapture,
      extraData,
      signature,
    };

    console.log("reqBody", reqBody);

    const { data } = await axios.post(endpoint, reqBody, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000,
      validateStatus: () => true,
    });

    // MoMo trả resultCode === 0 là OK

    if (Number(data?.resultCode) !== 0) {
      return { payUrl: undefined, raw: data };
    }

    return {
      payUrl: data.payUrl || data.shortLink,
      deeplink: data.deeplink,
      providerTransactionId: data.transId,
      raw: data,
    };
  }

  async verifyReturn(query: any): Promise<VerifyResult> {
    return {
      isValid: true,
      orderNumber: query?.orderId,
      providerTransactionId: query?.transId,
      amount: Number(query?.amount || 0),
      status: query?.resultCode === '0' ? 'SUCCESS' : 'FAILED',
      raw: query,
    };
  }

  async verifyWebhook(body: any): Promise<VerifyResult> {
    const { secretKey } = this.cfg();

    const {
      amount, orderId, orderInfo, orderType, transId, resultCode, message,
      payType, responseTime, extraData, requestId, signature,
    } = body || {};

    const accessKey = this.cfg().accessKey;
    const partnerCode = this.cfg().partnerCode;

    const raw =
      `accessKey=${accessKey}` +
      `&amount=${amount}` +
      `&extraData=${extraData ?? ''}` +
      `&message=${message}` +
      `&orderId=${orderId}` +
      `&orderInfo=${orderInfo}` +
      `&orderType=${orderType}` +
      `&partnerCode=${partnerCode}` +
      `&payType=${payType}` +
      `&requestId=${requestId}` +
      `&responseTime=${responseTime}` +
      `&resultCode=${resultCode}` +
      `&transId=${transId}`;

    const calc = this.sign(raw, secretKey);
    const ok = String(calc).toLowerCase() === String(signature || '').toLowerCase();
    const orderNumber = orderId.split('-')[0];
    return {
      isValid: ok,
      orderNumber,
      providerTransactionId: transId,
      amount: Number(amount || 0),
      status: ok && Number(resultCode) === 0 ? 'SUCCESS' : 'FAILED',
      raw: body,
    };
  }
}