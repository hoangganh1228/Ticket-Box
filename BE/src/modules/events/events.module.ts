import { RolesModule } from './../roles/roles.module';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { EventRepository } from './events.repo';
import { Events } from 'src/database/entities/Events';
import { CategoriesModule } from '../categories/categories.module';
import { EventsRepository } from './repositories/events.repository';
import { SettingsRepository } from './repositories/settings.repository';
import { Settings } from 'src/database/entities/Settings';
import { PaymentEvent } from 'src/database/entities/PaymentEvent';
import { PaymentEventRepository } from './repositories/payment-event.repository';
import { CloudinaryModule } from 'src/common/cloudinary/cloudinary.module';
import { FileUploadService } from 'src/common/services/file-upload.service';
import { EventRolePermissionModule } from '../event-role-permission/event-role-permission.module';
import { EventMembershipModule } from '../event-membership/event-membership.module';
import { UserModule } from '../user/user.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([Events, Settings, PaymentEvent]),
    CloudinaryModule,
    CategoriesModule,
    RolesModule,
    UserModule,
    forwardRef(() => EventRolePermissionModule),
    forwardRef(() => EventMembershipModule),
  ],
  controllers: [EventsController],
  providers: [EventsRepository, SettingsRepository, PaymentEventRepository, EventsService, FileUploadService, EventRepository],
  exports: [EventsService, EventsRepository, EventRepository]
})
export class EventsModule { }
