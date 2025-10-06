import {
  Controller,
  Patch,
  UseInterceptors,
  UseGuards,
  UploadedFile,
  Req,
  Body,
} from '@nestjs/common';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import * as fs from 'fs';
import * as path from 'path';
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @UseGuards(JwtAccessGuard)
  @Patch('update-profile')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const ext = path.extname(file.originalname);
          const filename = `${uuidv4()}${ext}`;
          cb(null, filename);
        },
      }),
    }),
  )
  async uploadProfile(
    @UploadedFile() avatar: Express.Multer.File, // Check for the uploaded file
    @Body() body: any,
    @Req() req: any,
  ) {
    const userId = req['user'].sub;

    // Check if the avatar file exists
    let avatarPath: string | null = null;
    if (avatar) {
      const currentUser = await this.userService.findById(userId);
      if (currentUser?.avatar) {
        const oldAvatarPath = path.join(process.cwd(), currentUser.avatar);
        // Check if the old file exists and delete it
        if (fs.existsSync(oldAvatarPath)) {
          fs.unlinkSync(oldAvatarPath);
          console.log(`Deleted old avatar: ${oldAvatarPath}`);
        }
      }
      avatarPath = `/uploads/${avatar.filename}`;
    }
    const updatedUser = await this.userService.uploadProfile(+userId, avatarPath, body);
    return updatedUser;
  }
}
