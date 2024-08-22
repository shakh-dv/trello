import {ApiProperty} from '@nestjs/swagger';
import {IsNotEmpty, IsNumber, IsString} from 'class-validator';
import {Board} from '@prisma/client';

export class CreateBoardDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({description: 'The ID of the user creating the board'})
  @IsNumber()
  @IsNotEmpty()
  userId!: number;
}

export type CreateBoardResultDTO = Board;
