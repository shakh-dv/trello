import {PartialType} from '@nestjs/swagger';
import {CreateColumnDTO} from './create-column.dto';
import {Column} from '@prisma/client';

export class UpdateColumnDTO extends PartialType(CreateColumnDTO) {}

export type UpdateColumnResultDTO = Column;
