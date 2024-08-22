import {ApiProperty} from '@nestjs/swagger';
import {IsNotEmpty, IsNumber, IsString} from 'class-validator';
import {Column} from '@prisma/client';

export class CreateColumnDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  boardId!: number;
}

export type CreateColumnResultDTO = Column;
