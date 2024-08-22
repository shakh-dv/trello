import {PartialType} from '@nestjs/swagger';
import {CreateCommentDTO} from './create-comment.dto';
import {Comment} from '@prisma/client';

export class UpdateCommentDTO extends PartialType(CreateCommentDTO) {}

export type UpdateCommentResultDTO = Comment;
