import { Injectable, Logger } from '@nestjs/common';
import { PAYMENT_METHOD, PAYMENT_STATUS } from 'src/common/enums/payment.enum';

export interface BankPaymentRequest {
  orderNumber: string;
  amount: number;
  currency: string;
  provider: string;
  method: PAYMENT_METHOD;
  userId: number;
}

export interface BankPaymentResponse {
  success: boolean;
  transactionId?: string;
  status: PAYMENT_STATUS;
  failureReason?: string;
  bankReference?: string;
  processingTime?: number;
}

@Injectable()
export class MockBankService {
  private readonly logger = new Logger(MockBankService.name);

  async processPayment(request: BankPaymentRequest): Promise<BankPaymentResponse> {
    this.logger.log(`�� Processing payment for order: ${request.orderNumber}`);
    
    // Simulate processing time (1-3 seconds)
    const processingTime = Math.random() * 2000 + 1000;
    await new Promise(resolve => setTimeout(resolve, processingTime));

    // Mock different scenarios based on provider and amount
    const successRate = this.getSuccessRate(request.provider, request.amount);
    const isSuccess = Math.random() < successRate;

    if (isSuccess) {
      const transactionId = this.generateTransactionId(request.provider);
      const bankReference = this.generateBankReference(request.provider);
      
      this.logger.log(`✅ Payment successful for order: ${request.orderNumber}`);
      
      return {
        success: true,
        transactionId,
        status: PAYMENT_STATUS.COMPLETED,
        bankReference,
        processingTime: Math.round(processingTime)
      };
    } else {
      const failureReason = this.getRandomFailureReason(request.provider);
      
      this.logger.log(`❌ Payment failed for order: ${request.orderNumber} - ${failureReason}`);
      
      return {
        success: false,
        status: PAYMENT_STATUS.FAILED,
        failureReason,
        processingTime: Math.round(processingTime)
      };
    }
  }

  private getSuccessRate(provider: string, amount: number): number {
    // Different success rates for different providers
    const baseRates = {
      'vietcombank': 0.95,
      'bidv': 0.92,
      'viettinbank': 0.90,
      'agribank': 0.88,
      'techcombank': 0.93,
    };

    let rate = baseRates[provider] || 0.85;
    
    // Lower success rate for high amounts
    if (amount > 1000000) {
      rate *= 0.9;
    }
    if (amount > 5000000) {
      rate *= 0.8;
    }

    // return Math.max(0.05, rate * 0.3);
    return rate;
  }

  private getRandomFailureReason(provider: string): string {
    const reasons = [
      'Insufficient funds',
      'Card expired',
      'Invalid card number',
      'Transaction timeout',
      'Bank maintenance',
      'Daily limit exceeded',
      'Card blocked',
      'Invalid CVV',
      'Network error',
      'Account suspended'
    ];

    return reasons[Math.floor(Math.random() * reasons.length)];
  }

  private generateTransactionId(provider: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9).toUpperCase();
    const providerCode = provider.toUpperCase().substr(0, 3);
    
    return `${providerCode}${timestamp}${random}`;
  }

  private generateBankReference(provider: string): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000000);
    
    return `REF${timestamp}${random.toString().padStart(6, '0')}`;
  }

  async simulateWebhook(transactionId: string, status: PAYMENT_STATUS): Promise<any> {
    this.logger.log(`�� Simulating webhook for transaction: ${transactionId}`);
    
    return {
      transactionId,
      status,
      timestamp: new Date().toISOString(),
      signature: this.generateWebhookSignature(transactionId, status)
    };
  }

  private generateWebhookSignature(transactionId: string, status: string): string {
    const data = `${transactionId}${status}${Date.now()}`;
    return Buffer.from(data).toString('base64');
  }
}
