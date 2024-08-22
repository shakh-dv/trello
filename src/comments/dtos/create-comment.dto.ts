import {ApiProperty} from '@nestjs/swagger';
import {IsNotEmpty, IsNumber, IsString} from 'class-validator';
import {Comment} from '@prisma/client';

export class CreateCommentDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  message!: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  userId!: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  cardId!: number;
}

export type CreateCommentResultDTO = Comment;
