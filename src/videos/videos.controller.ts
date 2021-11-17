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
  Req,
  Logger,
  StreamableFile,
} from '@nestjs/common';
import { VideosService } from './videos.service';
import { JwtAuthenticationGuard } from 'src/authentication/guards/jwt-authentication.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { randomBytes } from 'crypto';
import { extname } from 'path';
import { NOT_FOUND } from 'src/shared/constants/video.strings';
import { Request } from 'express';
import * as path from 'path';

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

  @Get('download/:id')
  async download(@Param('id') id: string, @Req() request: Request) {
    const video = await this.videosService.getById(+id);

    if (!video) {
      throw new HttpException(NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const videoPath = path.resolve(video.url);
    const videoBuffer = await this.videosService.getVideoBuffer(videoPath);
    const videoStream = await this.videosService.getReadableStreamVideo(videoBuffer);

    request.res.set({
      'Content-Type': 'video/mp4',
      'Content-Length': videoBuffer.length,
      'Content-Disposition': 'inline', // TODO: inline
    });

    Logger.log({ path: videoPath });

    return new StreamableFile(videoStream);
  }
}
