import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';
import {IsNotEmpty, IsNumber, IsString} from 'class-validator';
import {Card} from '@prisma/client';

export class CreateCardDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiPropertyOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  columnId!: number;
}

export type CreateCardResultDTO = Card;
