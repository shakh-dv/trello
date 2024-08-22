import {Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from '../core/infra/prisma/prisma.service';
import {
  CreateCommentDTO,
  CreateCommentResultDTO,
} from './dtos/create-comment.dto';
import {AccessTokenPayload} from '../auth/types/access-token-payload';
import {
  UpdateCommentDTO,
  UpdateCommentResultDTO,
} from './dtos/update-comment.dto';
import {Comment} from '@prisma/client';
import {GetCommentByIdResultDTO} from './dtos/get-comment-by-id.dto';
import {GetAllCommentsResultDTO} from './dtos/get-all-comments.dto';

@Injectable()
export class CommentsService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(
    data: CreateCommentDTO,
    accessToken: AccessTokenPayload
  ): Promise<CreateCommentResultDTO> {
    return this.prismaService.comment.create({
      data: {
        message: data.message,
        userId: accessToken.userId,
        cardId: data.cardId,
      },
      select: {
        id: true,
        message: true,
        userId: true,
        cardId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  getAll(): Promise<GetAllCommentsResultDTO> {
    return this.prismaService.comment.findMany({
      select: {
        id: true,
        message: true,
        userId: true,
        cardId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  getById(commentId: number): Promise<GetCommentByIdResultDTO> {
    return this.prismaService.comment.findFirst({
      where: {
        id: Number(commentId),
      },
      select: {
        id: true,
        message: true,
        userId: true,
        cardId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  getComments(userId: number, cardId: number): Promise<Comment[]> {
    return this.prismaService.comment.findMany({
      where: {
        cardId: Number(cardId),
        user: {
          id: Number(userId),
        },
      },
    });
  }

  async getByIdOrThrow(commentId: number): Promise<Comment> {
    const comment = await this.prismaService.comment.findUnique({
      where: {
        id: Number(commentId),
      },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return comment;
  }
  async update(
    commentId: number,
    data: UpdateCommentDTO,
    accessToken: AccessTokenPayload
  ): Promise<UpdateCommentResultDTO> {
    await this.getByIdOrThrow(commentId);

    return this.prismaService.comment.update({
      where: {
        id: Number(commentId),
      },
      data: {
        message: data.message,
        userId: accessToken.userId,
        cardId: data.cardId,
      },
      select: {
        id: true,
        message: true,
        userId: true,
        cardId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async delete(commentId: number) {
    await this.getByIdOrThrow(commentId);

    return this.prismaService.comment.delete({
      where: {
        id: Number(commentId),
      },
      select: {
        id: true,
        message: true,
        userId: true,
        cardId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
