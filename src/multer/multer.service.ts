import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

@Injectable()
export class MulterService {
  constructor(private readonly configService: ConfigService) {}

  get videoDirection(): string {
    return join(this.configService.get('UPLOAD_DIR'), 'videos');
  }
}
