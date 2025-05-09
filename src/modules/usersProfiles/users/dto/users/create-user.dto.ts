import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsInt, IsString } from 'class-validator';

export class CreateUserDto {
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
