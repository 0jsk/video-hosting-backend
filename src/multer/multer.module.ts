import { Global, Module } from '@nestjs/common';
import { MulterModule as Multer } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterService } from 'src/multer/multer.service';

@Global()
@Module({
  imports: [
    Multer.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        dest: configService.get('SERVER_HOST'),
      }),
    }),
    ConfigModule,
  ],
  providers: [MulterService],
  exports: [MulterService],
})
export class MulterModule {}
