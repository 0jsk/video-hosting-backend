import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { ConfigModule } from '@nestjs/config';
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
        PORT: J.number(),
      }),
    }),
    MulterModule.register({
      dest: './uploads',
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
