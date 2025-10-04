import { Module } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { EmailProcessor } from './email.processor';
import { RabbitmqModule } from 'src/common/rabbitmq/rabbitmq.module';
import { EmailModule } from 'src/common/email/email.module';

@Module({
  imports: [RabbitmqModule, EmailModule],
  providers: [NotificationsGateway, EmailProcessor],
  exports: [NotificationsGateway]
})
export class NotificationsModule {}
