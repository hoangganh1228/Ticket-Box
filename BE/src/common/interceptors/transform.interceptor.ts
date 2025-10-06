import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  HttpStatus,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

export interface Response<T> {
  success: boolean;
  statusCode: number;
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const http = context.switchToHttp();
    const res = http.getResponse();

    return next.handle().pipe(
      map((data) => {
        const statusCode = res?.statusCode ?? HttpStatus.OK;
        return {
          success: true,
          statusCode,
          data,
        };
      }),
    );
  }
}
