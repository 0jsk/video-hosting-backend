import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { VideosService } from './videos.service';
import { JwtAuthenticationGuard } from 'src/authentication/guards/jwt-authentication.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { randomBytes } from 'crypto';
import { extname } from 'path';

@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  async getAll() {
    return await this.videosService.getAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  async getById(@Param('id') id: string) {
    return await this.videosService.getById(+id);
  }

  @Post('upload')
  @UseGuards(JwtAuthenticationGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 10000000 },
      fileFilter: (_, file, cb) =>
        file.mimetype.includes('video')
          ? cb(null, true)
          : cb(new HttpException('Invalid file format', HttpStatus.BAD_REQUEST), false),
      storage: diskStorage({
        destination: './uploads/videos/' /* TODO: dynamic path based on configService UPLOAD_DIR */,
        filename: (_, file, cb) => cb(null, `${randomBytes(16).toString('hex')}${extname(file.originalname)}`),
      }),
    }),
  )
  async upload(@UploadedFile() file: Express.Multer.File) {
    return await this.videosService.create({ url: file.path });
  }
}
