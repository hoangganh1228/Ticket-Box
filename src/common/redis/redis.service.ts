import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { TTL } from '../enums/ttl.enum';

@Injectable()
export class RedisService implements OnModuleInit {
  private readonly redis: Redis;
  private readonly logger = new Logger(RedisService.name);

  constructor(private configService: ConfigService) {
    this.redis = new Redis({
      host: this.configService.get('redis.host'),
      port: this.configService.get('redis.port'),
      password: this.configService.get('redis.password'),
      db: this.configService.get('redis.db'),
      enableReadyCheck: false,
      maxRetriesPerRequest: 3,    // số lần retry khi kết nối redis thất bại
      lazyConnect: this.configService.get('redis.lazyConnect'),
      keepAlive: this.configService.get('redis.keepAlive'),        // TCP giữ cho kết nối luôn sống ngay cả khi không có request
    });
  }

  async onModuleInit() {
    // Test connection
    try {
      await this.redis.ping();
      console.log('✅ Redis connected successfully');
    } catch (error) {
      console.error('❌ Redis connection failed:', error);
    }
  }

  private readonly reserveTicketScript = `
    local ticketId = ARGV[1]
    local userId = ARGV[2]
    local quantity = tonumber(ARGV[3])
    local lockDuration = tonumber(ARGV[4]) or 300
    
    local availableKey = 'ticket:' .. ticketId .. ':available'
    local reservedKey = 'ticket:' .. ticketId .. ':reserved:' .. userId
    local lockKey = 'ticket:' .. ticketId .. ':lock:' .. userId
    
    -- Check if user already has a reservation
    local existingReservation = redis.call('GET', reservedKey)
    if existingReservation then
      return {'ALREADY_RESERVED', 'User already has a reservation for this ticket', 0, 0, 0}
    end

    -- Check if user has an active lock
    local existingLock = redis.call('GET', lockKey)
    if existingLock then
      return {'LOCKED', 'User already has an active lock for this ticket', 0, 0, 0}
    end

    -- Get current available tickets
    local available = tonumber(redis.call('GET', availableKey) or '0')

    -- Check if enough tickets are available
    if available < quantity then
      return {'OUT_OF_STOCK', 'Not enough tickets available', 0, available, 0}
    end
    
    -- ✅ RESERVE TICKETS ATOMICALLY:
    redis.call('DECRBY', availableKey, quantity)
    redis.call('SET', reservedKey, quantity, 'EX', lockDuration)
    redis.call('SET', lockKey, '1', 'EX', lockDuration)
    
    -- Get updated available count
    local newAvailable = tonumber(redis.call('GET', availableKey) or '0')
    
    return {
      'SUCCESS', 
      'Tickets reserved successfully',
      quantity,
      newAvailable,
      redis.call('TTL', reservedKey)
    }
  `

  private readonly releaseTicketScript = `
    local ticketId = ARGV[1]
    local userId = ARGV[2]
    local quantity = tonumber(ARGV[3])
    
    
    local availableKey = 'ticket:' .. ticketId .. ':available'
    local reservedKey = 'ticket:' .. ticketId .. ':reserved:' .. userId
    local lockKey = 'ticket:' .. ticketId .. ':lock:' .. userId
    
    -- Check if reservation exists
    local reserved = redis.call('GET', reservedKey)
    if not reserved then
      return {status = 'NOT_FOUND', message = 'No reservation found for this user'}
    end
    
    local reservedQuantity = tonumber(reserved)
    if reservedQuantity < quantity then
      return {status = 'INSUFFICIENT_RESERVATION', message = 'User has less reservations than requested'}
    end
    
    -- Release tickets atomically
    redis.call('INCRBY', availableKey, quantity)
    
    -- Update or remove reservation
    if reservedQuantity == quantity then
      redis.call('DEL', reservedKey)
      redis.call('DEL', lockKey)
    else
      redis.call('DECRBY', reservedKey, quantity)
    end
    
    local newAvailable = tonumber(redis.call('GET', availableKey) or '0')
    
    return {
      status = 'SUCCESS',
      message = 'Tickets released successfully',
      released = quantity,
      available = newAvailable
    }
  `

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Redis get error:', error);
      return null;
    }
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);
      if (ttl) {
        await this.redis.setex(key, ttl, serializedValue);
      } else {
        await this.redis.set(key, serializedValue);
      }
    } catch (error) {
      console.error('Redis set error:', error);
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (error) {
      console.error('Redis del error:', error);
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.redis.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Redis exists error:', error);
      return false;
    }
  }
  

  async reserveTickets(ticketId: number, userId: number, quantity: number, lockDuration: number = TTL.BOOKING) {
    try {
      
      const result = await this.redis.eval(
        this.reserveTicketScript,
        0,
        ticketId.toString(),
        userId.toString(),
        quantity.toString(),
        lockDuration.toString()
      );
      // Redis eval returns an array: [status, message, reserved, available, expiresAt]
      if (Array.isArray(result) && result.length >= 2) {
        const [status, message, reserved, available, expiresAt] = result;
        const parsedResult = {
          status: status as 'SUCCESS' | 'OUT_OF_STOCK' | 'ALREADY_RESERVED' | 'LOCKED' | 'ERROR',
          message: message as string,
          reserved: reserved ? parseInt(reserved.toString()) : undefined,
          available: available ? parseInt(available.toString()) : undefined,
          expiresAt: expiresAt ? parseInt(expiresAt.toString()) : undefined
        };
        this.logger.log(`🎫 Reservation attempt for ticket ${ticketId}, user ${userId}, quantity ${quantity}: ${parsedResult.status}`);
        if(parsedResult.status === 'SUCCESS') {
          await this.addReservationExpiry(ticketId, userId, quantity, TTL.BOOKING);
        }
        
        return parsedResult;
      }

      // Fallback for unexpected format
      this.logger.error(`❌ Unexpected Redis result format:`, result);
      return {
        status: 'ERROR',
        message: 'Unexpected result format from Redis'
      };
    } catch (error) {
      this.logger.error(`❌ Error reserving tickets:`, error);
      return {
        status: 'ERROR',
        message: 'Internal error during reservation'
      };
    }
  }

  async releaseReservedTickets(ticketId: number, userId: number, quantity: number){
    try {
      console.log("ticketId", ticketId);
      console.log("userId", userId);
      console.log("quantity", quantity);
      const result = await this.redis.eval(
        this.releaseTicketScript,
        0,
        ticketId.toString(),
        userId.toString(),
        quantity.toString()
      ) as {
        status: 'SUCCESS' | 'NOT_FOUND' | 'INSUFFICIENT' | 'ERROR';
        message: string;
        released?: number;
        available?: number;
      };

      this.logger.log(`🔄 Release attempt for ticket ${ticketId}, user ${userId}, quantity ${quantity}: ${result.status}`);

      
      return result;
    } catch (error) {
      this.logger.error(`❌ Error releasing tickets:`, error);
      return {
        status: 'ERROR',
        message: 'Internal error during release'
      };
    }
  }

  private buildReservationMember(ticketId: number, userId: number, quantity: number) {
    return `t:${ticketId}:u:${userId}:q:${quantity}:n:${Date.now()}`;
  }

  async addReservationExpiry(ticketId: number, userId: number, quantity: number, ttlSeconds: number) {
    const member = this.buildReservationMember(ticketId, userId, quantity);
    const score = Date.now() + ttlSeconds * 1000;

    const pipe = this.redis.pipeline();
    pipe.zadd('reservations:expiring', score, member);
    pipe.hset(`reservations:meta:${member}`, {
      ticketId: String(ticketId),
      userId: String(userId),
      quantity: String(quantity),
    } as any);
    pipe.expire(`reservations:meta:${member}`, ttlSeconds + 600); // giữ lâu hơn TTL
    await pipe.exec();
  }

  async cleanupReservationHolds(ticketId: number, userId: number): Promise<number> {
    try {
      let cursor = '0';
      let removed = 0;
      const pattern = `t:${ticketId}:u:${userId}:*`;
      do {
        const [nextCursor, scanned] = await this.redis.zscan('reservations:expiring', cursor, 'MATCH', pattern, 'COUNT', 100);  // zscan:scans members of the ZSET, not blocking the server.
        cursor = nextCursor;
        if (Array.isArray(scanned) && scanned.length > 0) {
          const pipe = this.redis.pipeline();
          for (let i = 0; i < scanned.length; i += 2) {
            const member = scanned[i];
            pipe.zrem('reservations:expiring', member);
            pipe.del(`reservations:meta:${member}`);
            removed++;
          }
          await pipe.exec();
        }
      } while (cursor !== '0');
      if (removed > 0) this.logger.log(`🧹 Removed ${removed} hold(s) for t:${ticketId} u:${userId}`);
      return removed;
    } catch (e) {
      this.logger.error('cleanupReservationHolds error:', e);
      return 0;
    }
  }
  
  async processExpiredReservationsBatch(maxBatchSize: number = 100) {
    const now = Date.now();
    const items = await this.redis.zrangebyscore('reservations:expiring', 0, now, 'LIMIT', 0, maxBatchSize);  // Returns at most maxBatchSize expired reservation IDs.
    let restored = 0;
    for(const item of items) {
      const meta = await this.redis.hgetall(`reservations:meta:${item}`);
      const ticketId = parseInt(meta.ticketId || '0', 10);
      const userId = parseInt(meta.userId || '0', 10);
      const quantity = parseInt(meta.quantity || '0', 10);
      if (!ticketId || !userId || !quantity) {
        await this.redis.zrem('reservations:expiring', item);
        await this.redis.del(`reservations:meta:${item}`);
        continue;
      }

      const reservedKey = `ticket:${ticketId}:reserved:${userId}`;
      const reserved = await this.redis.get(reservedKey);

      // ZREM trước để đảm bảo chỉ khôi phục 1 lần
      const removed = await this.redis.zrem('reservations:expiring', item);
      await this.redis.del(`reservations:meta:${item}`);


      // If the reservation was removed and there was no reservation, restore the tickets
      if (removed === 1 && !reserved) {
        const availableKey = `ticket:${ticketId}:available`;
        await this.redis.incrby(availableKey, quantity);
        restored += quantity;
        this.logger.log(`🧾 Restored ${quantity} tickets for ticket ${ticketId} (user ${userId})`);
      }
    }
    return restored;
  }
  
  async getEvent(eventId: number) {
    return this.get(`event:${eventId}`);
  }

  async setEvent(eventId: number, eventData: any, ttl?: number) {
    return this.set(`event:${eventId}`, eventData, ttl);
  }

  async delEvent(eventId: number) {
    return this.del(`event:${eventId}`);
  }

  async getShows(eventId: number) {
    return this.get(`shows:${eventId}`);
  }

  async setShows(eventId: number, showsData: any, ttl?: number) {
    return this.set(`shows:${eventId}`, showsData, ttl);
  }

  async delShows(eventId: number) {
    return this.del(`shows:${eventId}`);
  }

  // Thêm methods cache cho show
  async getShow(showId: number) {
    return this.get(`show:${showId}`);
  }

  async setShow(showId: number, showData: any, ttl?: number) {
    return this.set(`show:${showId}`, showData, ttl);
  }

  async delShow(showId: number) {
    return this.del(`show:${showId}`);
  }

  async confirmReservation(ticketId: number, userId: number, quantity: number): Promise<{
    status: 'SUCCESS' | 'NOT_FOUND' | 'INSUFFICIENT' | 'ERROR';
    message: string;
    confirmed?: number;
  }> {
    try {
      const reservedKey = `ticket:${ticketId}:reserved:${userId}`;
      const lockKey = `ticket:${ticketId}:lock:${userId}`;
      const reserved = await this.redis.get(reservedKey);
      if (!reserved) {
        return { status: 'NOT_FOUND', message: 'No reservation to confirm' };
      }
      const reservedQuantity = parseInt(reserved, 10);
      if (reservedQuantity < quantity) {
        return { status: 'INSUFFICIENT', message: 'Reserved quantity is less than requested confirm' };
      }

      if (reservedQuantity === quantity) {
        await this.redis.del(reservedKey);
        await this.redis.del(lockKey);
        await this.cleanupReservationHolds(ticketId, userId);
      } else {
        await this.redis.decrby(reservedKey, quantity);
      }
      this.logger.log(`✅ Confirmed reservation for ticket ${ticketId}, user ${userId}, qty ${quantity}`);
      return { status: 'SUCCESS', message: 'Confirmed', confirmed: quantity };
    } catch (e) {
      this.logger.error('Confirm reservation error:', e);
      return { status: 'ERROR', message: 'Internal error' };
    }
  }

  async getTicketTracking(ticketId: number): Promise<{
    reserved: number;
    confirmed: number;
  }> {
    const reservedKeys = await this.redis.keys(`ticket:${ticketId}:reserved:*`)
    const confirmedKeys = await this.redis.keys(`ticket:${ticketId}:confirmed:*`)

    let reservedTotal = 0;
    for(const key of reservedKeys) {
      const value = await this.redis.get(key)
      if (value) {
        reservedTotal += parseInt(value)
      }
    }

    let confirmedTotal = 0;
    for(const key of confirmedKeys) {
      const value = await this.redis.get(key)
      if (value) {
        confirmedTotal += parseInt(value)
      }
    }

    return {
      reserved: reservedTotal,
      confirmed: confirmedTotal,
    }
  }

  async cleanupExpiredReservations(): Promise<void> {
    const script = `
      local pattern = ARGV[1]
      local keys = redis.call('KEYS', pattern)
      local count = 0
      
      for i, key in ipairs(keys) do
        local ttl = redis.call('TTL', key)
        if ttl < 0 then
          redis.call('DEL', key)
          count = count + 1
        end
      end
      return count
    `

    try {
      const result = await this.redis.eval(script, 0, 'ticket:*:reserved:*');
      this.logger.log(`🧹 Cleaned up ${result} expired reservations`);
    } catch (error) {
      this.logger.error('Cleanup failed:', error);
    }
  }

  async ping() {
    return this.redis.ping();
  }

  async initializeTicketInventory(ticketId: number, totalTickets: number): Promise<void> {
    const availableKey = `ticket:${ticketId}:available`;
    await this.redis.set(availableKey, String(totalTickets), 'NX');
    this.logger.log(`🎫 Initialized inventory for ticket ${ticketId}: ${totalTickets} tickets`);
  }

  async getTicketAvailability(ticketId: number): Promise<number> {
    const availableKey = `ticket:${ticketId}:available`;
    const available = await this.redis.get(availableKey);
    return available ? parseInt(available) : 0;
  }

  async getTTL(key: string): Promise<number> {
    try {
      const ttl = await this.redis.ttl(key);
      return ttl;
    } catch (error) {
      console.error('Redis TTL error:', error);
      return -1;
    }
  }
}