// src/common/middleware/logger.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const start = Date.now();
    res.on('finish', () => {
      const ms = Date.now() - start;
      // bạn có thể thay bằng morgan/winston
      // eslint-disable-next-line no-console
      console.log(`[${req.id}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${ms}ms`);
    });
    next();
  }
}
