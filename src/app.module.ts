import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/usersProfiles/users/users.module';
import { EnvConfiguration } from './config/env.config';
import { databaseProviders } from './providers/database.providers';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/usersProfiles/users/entities/user.entity';
import { DataSource } from 'typeorm';
import { AuthModule } from './auth/auth.module';
import { GlobalTexts } from './data/constants/texts';
import { Profile } from './modules/usersProfiles/users/entities/profile.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [EnvConfiguration],
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.HOST,
      port: 3306,
      username: process.env.USER_NAME,
      password: process.env.PASSWORD,
      database: process.env.DATA_BASE,
      entities: [User, Profile],
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, GlobalTexts],
  exports: [],
})
export class AppModule {}
