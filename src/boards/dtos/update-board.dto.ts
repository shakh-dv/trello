import {PartialType} from '@nestjs/swagger';
import {CreateBoardDTO} from './create-board.dto';
import {Board} from '@prisma/client';

export class UpdateBoardDTO extends PartialType(CreateBoardDTO) {}

export type UpdateBoardResultDTO = Board;
