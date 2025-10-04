import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PaymentMethodRepo } from './payment-method.repo';
import { vnpConfig } from 'src/config/vnpay.config';
import * as qs from 'qs';
import * as crypto from 'crypto';
import * as moment from 'moment';

@Injectable()
export class PaymentMethodService {
  constructor(private readonly paymentMethodRepo: PaymentMethodRepo) {}

  findAll() {
    return this.paymentMethodRepo.findAll();
  }

  createVNPayUrl(expired ,orderCode: string, amount: number, clientIp: string): string {
    if (!orderCode || amount <= 0) {
      throw new Error('Invalid orderCode or amount');
    }

    const createDate = moment().format('YYYYMMDDHHmmss');

    let vnpUrl = vnpConfig.vnp_Url;
    let vnpParams: Record<string, string | number> = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: vnpConfig.vnp_TmnCode,
      vnp_Amount: amount * 100,
      vnp_CurrCode: 'VND',
      vnp_TxnRef: orderCode,
      vnp_OrderInfo: `Thanh toan don hang ${orderCode}`,
      vnp_OrderType: 'other',
      vnp_Locale: 'vn',
      vnp_ReturnUrl: vnpConfig.vnp_ReturnUrl,
      vnp_IpAddr: clientIp,
      vnp_CreateDate: createDate,
    };

    vnpParams = this.sortObject(vnpParams);

    const signData = qs.stringify(vnpParams, { encode: false });
    const hmac = crypto.createHmac('sha512', vnpConfig.vnp_HashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    vnpParams['vnp_SecureHash'] = signed;
    vnpUrl += '?' + qs.stringify(vnpParams, { encode: false });

    return vnpUrl;
  }

  private sortObject(obj: Record<string, any>): Record<string, any> {
    const sorted: Record<string, any> = {};
    const keys = Object.keys(obj).sort();
    for (const key of keys) {
      sorted[key] = encodeURIComponent(obj[key]).replace(/%20/g, '+');
    }
    return sorted;
  }

  verifySignature(query: any): boolean {
    let vnp_Params = query;
    const secureHash = vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = this.sortObject(vnp_Params);

    let querystring = require('qs');
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");     
    let hmac = crypto.createHmac("sha512", vnpConfig.vnp_HashSecret);
    const signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");   

    return secureHash === signed;
  }

  
}
