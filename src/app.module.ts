import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from 'src/database/database.module';
import { VideosModule } from './videos/videos.module';
import { MulterModule } from '@nestjs/platform-express';
import * as J from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: J.object({
        POSTGRES_HOST: J.string().required(),
        POSTGRES_PORT: J.number().required(),
        POSTGRES_USER: J.string().required(),
        POSTGRES_PASSWORD: J.string().required(),
        POSTGRES_DB: J.string().required(),
        JWT_SECRET: J.string().required(),
        JWT_EXPIRATION_TIME: J.string().required(),
        SERVER_HOST: J.string().required(),
        UPLOAD_DIR: J.string().required(),
        PORT: J.number(),
      }),
    }),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        dest: configService.get('SERVER_HOST'),
      }),
    }),
    DatabaseModule,
    AuthenticationModule,
    UsersModule,
    VideosModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
