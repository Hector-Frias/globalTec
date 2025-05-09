import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateProfileDto {
  @ApiProperty()
  @IsString()
  profileCode: string;

  @ApiProperty()
  @IsString()
  profileName: string;
}
