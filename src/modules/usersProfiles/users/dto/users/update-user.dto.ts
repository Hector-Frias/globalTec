import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty()
  @IsString()
  userName: string;

  @ApiProperty()
  @IsString()
  @IsEmail()
  userEmail: string;

  @ApiProperty()
  @IsInt()
  userAge: number;

  @ApiProperty()
  @IsInt()
  userprofileId: number;
}
