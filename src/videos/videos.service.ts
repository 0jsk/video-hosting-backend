import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { Video } from 'src/videos/entities/video.entity';
import { NOT_FOUND } from 'src/shared/constants/video.strings';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Readable } from 'stream';
import { promises as fs } from 'fs';

@Injectable()
export class VideosService {
  constructor(@InjectRepository(Video) private readonly videoRepository: Repository<Video>) {}

  async create(createVideoDto: CreateVideoDto) {
    const newVideo = this.videoRepository.create(createVideoDto);
    return await this.videoRepository.save(newVideo);
  }

  async getAll() {
    return await this.videoRepository.find();
  }

  async getById(id: number) {
    const video = this.videoRepository.findOne({ id });

    if (!video) {
      throw new HttpException(NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return video;
  }

  async update(id: number, videoData: UpdateVideoDto) {
    return await this.videoRepository.update({ id }, videoData);
  }

  async remove(id: number) {
    const video = await this.videoRepository.findOne({ id });

    if (!video) {
      throw new HttpException(NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return await this.videoRepository.remove([video]);
  }

  async getVideoBuffer(videoPath: string): Promise<Buffer> {
    return await fs.readFile(videoPath);
  }

  async getReadableStreamVideo(videoBuffer: Buffer): Promise<Readable> {
    const stream = new Readable();

    stream.push(videoBuffer);
    stream.push(null);

    return stream;
  }
}
