// src/common/email/email.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: Transporter;

  constructor(private readonly config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.config.get<string>('MAIL_HOST'),
      port: this.config.get<number>('MAIL_PORT'),
      secure: String(this.config.get('MAIL_SECURE')) === 'true',
      auth: {
        user: this.config.get<string>('MAIL_USER'),
        pass: this.config.get<string>('MAIL_PASS'),
      },
    });
  }

  async send(options: { to: string; subject: string; html?: string; text?: string }) {
    const from = this.config.get<string>('MAIL_FROM');
    await this.transporter.sendMail({ from, ...options });
    this.logger.log(`📧 Sent email to ${options.to} - ${options.subject}`);
  }

  // demo template đơn giản
  render(template: string, data: any): { subject: string; html: string } {
    if (template === 'order_paid') {
      const subject = `Thanh toán thành công đơn ${data.orderNumber}`;
      const html = `
        <div>
          <h3>Thanh toán thành công</h3>
          <p>Đơn hàng: <b>${data.orderNumber}</b></p>
          <p>Mã booking: <b>${data.bookingId}</b></p>
          <p>Số tiền: <b>${data.amount} ${data.currency}</b></p>
          <p>Thời gian: <b>${data.paidAt}</b></p>
        </div>
      `;
      return { subject, html };
    }
    return { subject: 'Notification', html: `<pre>${JSON.stringify(data, null, 2)}</pre>` };
  }
}