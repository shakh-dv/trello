import {PartialType} from '@nestjs/swagger';
import {CreateCardDTO} from './create-card.dto';
import {Card} from '@prisma/client';

export class UpdateCardDTO extends PartialType(CreateCardDTO) {}

export type UpdateCardResultDTO = Card;
