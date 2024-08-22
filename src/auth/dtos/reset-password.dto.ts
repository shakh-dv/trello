import {ApiProperty} from '@nestjs/swagger';
import {IsNotEmpty, IsString} from 'class-validator';

export class ResetPasswordDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  oldPassword!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  newPassword!: string;
}

export type ResetPasswordResultDTO = void;
