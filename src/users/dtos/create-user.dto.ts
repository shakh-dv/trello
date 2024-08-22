import {IsEmail, IsNotEmpty, IsString} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';
import {User} from '@prisma/client';

export class CreateUserDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  username!: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password!: string;
}

export type CreateUserResultDTO = Omit<User, 'password'>;
