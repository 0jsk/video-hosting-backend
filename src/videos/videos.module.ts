import { Module } from '@nestjs/common';
import { VideosService } from './videos.service';
import { VideosController } from './videos.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Video } from 'src/videos/entities/video.entity';
import { MulterModule } from 'src/multer/multer.module';

@Module({
  imports: [TypeOrmModule.forFeature([Video]), ConfigModule, MulterModule],
  controllers: [VideosController],
  providers: [VideosService],
  exports: [VideosService],
})
export class VideosModule {}
