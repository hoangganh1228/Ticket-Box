import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RabbitmqService } from 'src/common/rabbitmq/rabbitmq.service';
import { BookingService } from './booking.service';
import { Interval } from '@nestjs/schedule';
import { RedisService } from 'src/common/redis/redis.service';
@Injectable()
export class BookingProcessor implements OnModuleInit {

  private readonly logger = new Logger(BookingProcessor.name);

  constructor(
    private readonly rabbitmqService: RabbitmqService,
    private readonly bookingService: BookingService,
    private readonly redisService: RedisService,
  ) {}

  async onModuleInit() {
    await this.subscribeToBookingQueue();
    this.logger.log('🎫 Booking Processor initialized');
  }

  @Interval(1000)
  async reclaimExpiredReservations() {
    try {
      const restored = await this.redisService.processExpiredReservationsBatch(200);
      if (restored > 0) {
        this.logger.log(`🔄 Restored ${restored} expired tickets back to inventory`);
      }
    } catch (e) {
      this.logger.error('reclaimExpiredReservations error', e as Error);
    }
  }

  private async subscribeToBookingQueue() {
    try {
      await this.rabbitmqService.consumeBooking(async (message) => {
        await this.processBookingRequest(message);
      });
      this.logger.log('📥 Subscribed to booking queue');
    } catch (error) {
      this.logger.error('Failed to subscribe to booking queue:', error);
    }
  }

  private async processBookingRequest(message: any) {
    const { dto, retryCount = 0 } = message;
    try {
      
      // Process the booking
      await this.bookingService.processBookingFromQueue(dto);
      
      
    } catch (error) {
      
      // Handle retry logic
      if (retryCount < 3) {
        const delayMs = Math.pow(2, retryCount) * 1000; // Exponential backoff
        await this.rabbitmqService.requeueWithDelay({
          ...message,
          retryCount: retryCount + 1
        }, delayMs);
      } else {
        
        await this.rabbitmqService.publishBookingToDeadLetter({
          ...message,
          retryCount: retryCount + 1
        }, `Failed after ${retryCount + 1} attempts: ${error.message}`);
      }
    }
  }
}