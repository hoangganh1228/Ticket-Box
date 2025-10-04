import { Injectable } from '@nestjs/common';
import { CloudinaryService } from '../../cloudinary/cloudinary.service';

export interface EventFiles {
  thumbnail: Express.Multer.File[];
  banner: Express.Multer.File[];
  org_thumbnail: Express.Multer.File[];
}

export interface UploadedUrls {
  thumbnail: string;
  banner: string;
  org_thumbnail: string;
}

@Injectable()
export class EventFileUploadService {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  async uploadEventFiles(files: EventFiles): Promise<UploadedUrls> {
    const [thumbnailResult, bannerResult, orgThumbnailResult] = await Promise.all([
      this.cloudinaryService.uploadImage(files.thumbnail[0]),
      this.cloudinaryService.uploadImage(files.banner[0]),
      this.cloudinaryService.uploadImage(files.org_thumbnail[0]),
    ]);

    return {
      thumbnail: thumbnailResult.secure_url,
      banner: bannerResult.secure_url,
      org_thumbnail: orgThumbnailResult.secure_url,
    };
  }

  async deleteEventFiles(publicIds: string[]): Promise<void> {
    const deletePromises = publicIds.map(publicId => 
      this.cloudinaryService.deleteImage(publicId)
    );
    await Promise.all(deletePromises);
  }
}