import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import rabbitmqConfig from 'src/config/rabbitmq.config';
import { RabbitmqService } from './rabbitmq.service';

@Global()
@Module({
  imports: [
    ConfigModule.forFeature(rabbitmqConfig),
  ],
  providers: [RabbitmqService],
  exports: [RabbitmqService],
})
export class RabbitmqModule {}
