import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RabbitmqService, EmailNotificationMessage } from 'src/common/rabbitmq/rabbitmq.service';
import { EmailService } from 'src/common/email/email.service';

@Injectable()
export class EmailProcessor implements OnModuleInit {
  private readonly logger = new Logger(EmailProcessor.name);

  constructor(
    private readonly rabbitmqService: RabbitmqService,
    private readonly emailService: EmailService,
  ) {}

  async onModuleInit() {
    await this.rabbitmqService.consumeEmailNotification(async (msg: EmailNotificationMessage) => {
      const { subject, html } = this.emailService.render(msg.template, msg.data);
      await this.emailService.send({ to: msg.to, subject: msg.subject || subject, html });
      this.logger.log(`✅ Email processed -> ${msg.to}`);
    });
  }
}