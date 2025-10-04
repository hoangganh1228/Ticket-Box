import { registerAs } from '@nestjs/config';

export default registerAs('rabbitmq', () => ({
  url: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
  exchange: process.env.RABBITMQ_EXCHANGE || 'booking_exchange',               
  queue: process.env.RABBITMQ_QUEUE || 'booking_queue',                        
  deadLetterExchange: process.env.RABBITMQ_DLX || 'booking_dead_letter_exchange', // collect processing errors in a separate place for retry, logging, inspection, or other handling (e.g., sending error notification emails).
  deadLetterQueue: process.env.RABBITMQ_DLQ || 'booking_dead_letter',           // store error messages for analysis/retry/reprocessing; helps prevent the main queue from being blocked.
  routingKey: process.env.RABBITMQ_ROUTING_KEY || 'booking', 
  prefetch: parseInt(process.env.RABBITMQ_PREFETCH || '10'),
  consumerCount: parseInt(process.env.RABBITMQ_CONSUMER_COUNT || '5'),          // number of concurrent consumers to process messages
}));

