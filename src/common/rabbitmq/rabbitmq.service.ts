import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { connect, ChannelModel, Channel } from 'amqplib';
export interface BookingMessage {
  orderId: number;
  userId: number;
  items: Array<{
    ticketId: number;
    showId: number;
    quantity: number;
    unitPrice: number;
  }>;
  amount: number;
  createdAt: string;
  expiresAt: string;
}
export interface BookingRequestMessage {
  bookingId: string;
  userId: number;
  eventId?: number;
  dto: any;
  retryCount?: number;
}
export interface EmailNotificationMessage {
  to: string;
  subject: string;
  template: string;
  data: any;
  retryCount?: number;
}
@Injectable()
export class RabbitmqService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RabbitmqService.name);
  private connection: ChannelModel | null = null;
  private channel: Channel | null = null;


  
  // Booking queue
  private readonly bookingQueue = 'booking.queue';
  private readonly bookingRetryQueue = 'booking.queue.retry';
  private readonly bookingDeadLetterQueue = 'booking.queue.dlq';

  private readonly emailQueue = 'notification.email.queue';
  private readonly emailRetryQueue = 'notification.email.queue.retry';
  private readonly emailDeadLetterQueue = 'notification.email.queue.dlq';

  private readonly url: string;
  private readonly prefetch: number;
  private readonly consumerCount: number;

  constructor(private readonly configService: ConfigService) {
    this.url = this.configService.get<string>('rabbitmq.url')!;
    this.prefetch = this.configService.get<number>('rabbitmq.prefetch')!;
    this.consumerCount = this.configService.get<number>('rabbitmq.consumerCount')!;
  }

  async onModuleInit() {
    await this.connect();
    await this.setup();
  }

  async onModuleDestroy() {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      if (this.connection) {
        await this.connection.close(); 
      }
    } catch (error) {
      this.logger.error('Error closing RabbitMQ connection', error as Error);
    } finally {
      this.channel = null;
      this.connection = null;
    }
  }

  private async connect() {
    this.connection = await connect(this.url); // ChannelModel
    this.channel = await this.connection.createChannel(); // Channel
    this.logger.log('RabbitMQ connected');
  }

  private async setup() {
    if (!this.channel) throw new Error('Channel not initialized');
    // Booking main queue: nack -> vào booking DLQ (default exchange)
    await this.channel.assertQueue(this.bookingQueue, {
      durable: true,
      arguments: {
        'x-dead-letter-exchange': '',
        'x-dead-letter-routing-key': this.bookingDeadLetterQueue,
      },
    });

    await this.channel.assertQueue(this.bookingRetryQueue, {
      durable: true,
      arguments: {
        'x-dead-letter-exchange': '',
        'x-dead-letter-routing-key': this.bookingQueue,
      },
    });

    // Booking DLQ
    await this.channel.assertQueue(this.bookingDeadLetterQueue, { durable: true });


    await this.channel.assertQueue(this.emailQueue, {
      durable: true,
      arguments: {
        'x-dead-letter-exchange': '',
        'x-dead-letter-routing-key': this.emailDeadLetterQueue,
      },
    });

    await this.channel.assertQueue(this.emailRetryQueue, {
      durable: true,
      arguments: {
        'x-dead-letter-exchange': '',
        'x-dead-letter-routing-key': this.emailQueue,
      },
    });

    await this.channel.assertQueue(this.emailDeadLetterQueue, { durable: true });

    await this.channel.prefetch(this.prefetch);
    this.logger.log(`🔧 RabbitMQ setup completed - Prefetch: ${this.prefetch}`);
  }

 
  async consumeBooking(handler: (msg: BookingMessage) => Promise<void>): Promise<void> {
    if (!this.channel) throw new Error('Channel not initialized');

    // Start multiple consumers for better throughput
    for (let i = 0; i < this.consumerCount; i++) {
      await this.channel.consume(
        this.bookingQueue,
        async (raw) => {
          if (!raw) return;

          try {
            const content = JSON.parse(raw.content.toString()) as BookingMessage;
            this.logger.log(`📥 Processing order ${content.orderId} (consumer ${i + 1})`);
            
            // ✅ Chỉ gọi handler, không expect return value
            await handler(content);
            
            // Acknowledge message
            this.channel!.ack(raw);
            
            // ✅ Sửa log message
            this.logger.log(`✅ Order ${content.orderId} processed successfully`);
            
          } catch (error) {
            this.logger.error(`❌ Error processing message:`, error);
            
            // Send to dead letter queue
            this.channel!.nack(raw, false, false);
          }
        },
        { noAck: false }
      );
    }

    this.logger.log(` Started ${this.consumerCount} consumers`);
  }

  async consumeEmailNotification(handler: (msg: EmailNotificationMessage) => Promise<void>): Promise<void> {
    if (!this.channel) throw new Error('Channel not initialized');

    await this.channel.consume(
      this.emailQueue,
      async (raw) => {
        if (!raw) return;
        try {
          const content = JSON.parse(raw.content.toString()) as EmailNotificationMessage;
          await handler(content);
          this.channel!.ack(raw);
          this.logger.log(`✅ Email notification ${content.to} processed successfully`);
        } catch (error) {
          this.logger.error(`❌ Error processing message:`, error);
          this.channel!.nack(raw, false, false);
        }
      },
      { noAck: false }
    );
  }


  async publishToDeadLetter(message: BookingMessage | BookingRequestMessage, reason: string, type: 'payment' | 'booking' = 'payment'): Promise<void> {
    if (!this.channel) throw new Error('Channel not initialized');
  
    const deadLetterMessage = {
      ...message,
      reason,
      type,
      timestamp: new Date().toISOString(),
    };
  
  
    await this.channel.publish(
      '',
      this.bookingDeadLetterQueue,
      Buffer.from(JSON.stringify(deadLetterMessage)),
      {
        persistent: true,
      }
    );
    
    const messageId = 'orderId' in message ? message.orderId : message.bookingId;
    this.logger.log(`💀 Sent ${type} ${messageId} to dead letter queue: ${reason}`);
  }
  
  async publishBookingToDeadLetter(message: BookingRequestMessage, reason: string): Promise<void> {
    return this.publishToDeadLetter(message, reason, 'booking');
  }

  async getQueueStats(): Promise<{
    messageCount: number;
    consumerCount: number;
    queueName: string;
  }> {
    if (!this.channel) throw new Error('Channel not initialized');

    const queueInfo = await this.channel.checkQueue(this.bookingQueue);
    return {
      messageCount: queueInfo.messageCount,
      consumerCount: queueInfo.consumerCount,
      queueName: this.bookingQueue,
    }
  }

  async publishBookingRequest(msg: BookingRequestMessage): Promise<void> {
    if (!this.channel) throw new Error('Channel not initialized');
    const ok = this.channel.publish('', this.bookingQueue, Buffer.from(JSON.stringify(msg)), { persistent: true });
    if (!ok) throw new Error('Booking queue backpressure');
  }
  async publishEmailNotification(msg: EmailNotificationMessage): Promise<void> {
    if (!this.channel) throw new Error('Channel not initialized');
    const ok = this.channel.publish('', this.emailQueue, Buffer.from(JSON.stringify(msg)), { persistent: true });
    if (!ok) throw new Error('Email queue backpressure');
  }

  async requeueWithDelay(msg: BookingRequestMessage, delayMs: number) {
    if (!this.channel) throw new Error('Channel not initialized');
    const ok = this.channel.publish('', this.bookingRetryQueue, Buffer.from(JSON.stringify(msg)), {
      persistent: true,
      expiration: String(delayMs), // backoff động
    });
    if (!ok) throw new Error('Retry queue backpressure');
  }

  async getBookingQueueStats() {
    if (!this.channel) throw new Error('Channel not initialized');
    const info = await this.channel.checkQueue(this.bookingQueue);
    return { queueName: this.bookingQueue, messageCount: info.messageCount, consumerCount: info.consumerCount };
  }
}