export enum PAYMENT_METHOD {
  CARD = 'card',
  EWALLET = 'ewallet',
  BANK_APP = 'bank_app',
  QR = 'qr',
}

export enum PAYMENT_STATUS {
  PENDING = 'pending',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
  COMPLETED = 'completed',
}
