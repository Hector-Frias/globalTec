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

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [EnvConfiguration],
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Llampa20',
      database: 'globaltec',
      entities: [User],
      autoLoadEntities: true,
      // synchronize: true,
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [],
})
export class AppModule {}
