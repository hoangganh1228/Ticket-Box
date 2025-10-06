import {
  ClassSerializerInterceptor,
  MiddlewareConsumer,
  Module,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { RequestIdMiddleware } from './common/middleware/request-id.middleware';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { CategoriesModule } from './modules/categories/categories.module';
import { EventsModule } from './modules/events/events.module';
import { RolesModule } from './modules/roles/roles.module';
import { EventMembershipModule } from './modules/event-membership/event-membership.module';
import { EventRoleModule } from './modules/event-role/event-role.module';
import { EventRolePermissionModule } from './modules/event-role-permission/event-role-permission.module';
import { PermissionEventModule } from './modules/permission-event/permission-event.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { ShowsModule } from './modules/shows/shows.module';
import { TicketsModule } from './modules/tickets/tickets.module';
import cloudinaryConfig from './config/cloudinary.config';
import { CloudinaryModule } from './common/cloudinary/cloudinary.module';
import redisConfig from './config/redis.config';
import { UserRolePermissionModule } from './modules/user-role-permission/user-role-permission.module';
import { BookingModule } from './modules/booking/booking.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationsModule } from './modules/notifications/notifications.module';
import securityConfig from './config/security.config';
import { SecurityModule } from './modules/security/security.module';
import { PaymentsGatewayModule } from './modules/payments-gateway/payments-gateway.module';
import paymentsConfig from './config/payments.config';
import googleConfig from './config/google-auth.config';
import { PaymentMethodModule } from './modules/payment-method/payment-method.module';
import { UserModule } from './modules/user/user.module';
import { PaymentTransactionModule } from './modules/payment-transaction/payment-transaction.module';

@Module({

  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [cloudinaryConfig, redisConfig, securityConfig, paymentsConfig, googleConfig],
    }),
    ScheduleModule.forRoot(),
    UserRolePermissionModule,
    BookingModule,
    NotificationsModule,
    OrdersModule,
    ScheduleModule,
    DatabaseModule,
    AuthModule,
    CategoriesModule,
    EventsModule,
    SecurityModule,
    RolesModule,
    PaymentsGatewayModule,
    EventMembershipModule,
    PermissionEventModule,
    EventRoleModule,
    EventRolePermissionModule,
    PermissionsModule,
    ShowsModule,
    TicketsModule,
    CloudinaryModule,
    PaymentMethodModule,
    UserModule,
    PaymentTransactionModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware, LoggerMiddleware).forRoutes('*');
  }
}
