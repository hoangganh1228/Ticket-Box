import { Module } from '@nestjs/common';
import { EventFileUploadService } from './event-file-upload.service';
import { CloudinaryModule } from '../../cloudinary/cloudinary.module';

@Module({
  imports: [CloudinaryModule],
  providers: [EventFileUploadService],
  exports: [EventFileUploadService],
})
export class EventFileUploadModule {}