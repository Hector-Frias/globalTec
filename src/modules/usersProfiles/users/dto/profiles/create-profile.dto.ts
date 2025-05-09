import { IsString } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  profileCode: string;

  @IsString()
  profileName: string;
}
