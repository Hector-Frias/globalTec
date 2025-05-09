import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controllers';
import { JwtStrategy } from './strategies/jwt.strategy';
import { User } from 'src/modules/usersProfiles/users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GlobalTexts } from 'src/data/constants/texts';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.register({
      secret: 'jwt_secret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, GlobalTexts],
  exports: [AuthService],
})
export class AuthModule {}
