import { Injectable } from "@nestjs/common";
import { CloudinaryService } from "../cloudinary/cloudinary.service";

@Injectable()
export class FileUploadService {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  async uploadEventFiles(files: {
    thumbnail?: Express.Multer.File[];
    banner?: Express.Multer.File[];
    org_thumbnail?: Express.Multer.File[];
  }) {
    const fileFields = ['thumbnail', 'banner', 'org_thumbnail'] as const;
    return this.uploadMultipleFiles(files, fileFields);
  }

  async uploadMultipleFiles(files: any, fileFields: readonly string[]) {
    const uploadPromises = fileFields.map(async (fieldName) => {
      if (files[fieldName] && files[fieldName][0]) {
        const result = await this.cloudinaryService.uploadImage(files[fieldName][0]);
        return { [fieldName]: result.secure_url };
      }
      return { [fieldName]: null };
    });

    const results = await Promise.all(uploadPromises);
    return results.reduce((acc, result) => ({ ...acc, ...result }), {});
  }

  async validateFileTypes(files: any, allowedTypes: string[]) {
    // Logic validate file types
  }

  async deleteFiles(publicIds: string[]) {
    // Logic delete files
  }
}
