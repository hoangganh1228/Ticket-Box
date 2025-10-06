// src/modules/payments-gateway/providers/payment-provider.interface.ts
export interface CreatePaymentInput {
  orderNumber: string | number;
  amount: number;
  description?: string;
  userId: number;
  ipAddress?: string;
  ShowId?: number;
  EventId?: number;
}

export interface CreatePaymentResult {
  payUrl?: string;
  deeplink?: string;
  qrCodeUrl?: string;
  providerTransactionId?: string;
  raw?: any;
}

export interface VerifyResult {
  isValid: boolean;
  orderNumber?: string;
  providerTransactionId?: string;
  amount?: number;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  raw?: any;
}

export interface PaymentProvider {
  getName(): 'momo';
  createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult>;
  verifyReturn(query: any): Promise<VerifyResult>;
  verifyWebhook(body: any): Promise<VerifyResult>;
}