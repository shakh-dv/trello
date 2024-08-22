import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import {PrismaService} from '../../core/infra/prisma/prisma.service';
import {Reflector} from '@nestjs/core';
import {Request} from '../../shared/types/request';

@Injectable()
export class OwnershipGuard implements CanActivate {
  private readonly entityHandlers: Record<
    string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (entityId: number, userId: number) => Promise<boolean>
  >;

  constructor(
    private readonly prisma: PrismaService,
    private readonly reflector: Reflector
  ) {
    this.entityHandlers = {
      board: this.isBoardOwner.bind(this),
      column: this.isColumnOwner.bind(this),
      card: this.isCardOwner.bind(this),
      comment: this.isCommentOwner.bind(this),
    };
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const userId = request.accessTokenPayload?.userId;
    const entityType = this.reflector.get<string>(
      'entityType',
      context.getHandler()
    );

    if (!userId) {
      throw new ForbiddenException('User ID is missing.');
    }

    if (!entityType) {
      throw new Error('Entity type is not specified for the guard.');
    }

    const entityId = Number(request.params.id);

    if (isNaN(entityId)) {
      throw new Error('Entity ID is invalid.');
    }

    const isOwner = await this.checkOwnership(entityType, entityId, userId);

    if (!isOwner) {
      throw new ForbiddenException(
        'You do not have permission to modify this entity.'
      );
    }

    return true;
  }

  private async checkOwnership(
    entityType: string,
    entityId: number,
    userId: number
  ): Promise<boolean> {
    const handler = this.entityHandlers[entityType];

    if (!handler) {
      throw new Error('Unknown entity type.');
    }

    return handler(entityId, userId);
  }

  private async isBoardOwner(
    entityId: number,
    userId: number
  ): Promise<boolean> {
    const board = await this.prisma.board.findUnique({
      where: {id: entityId},
      select: {userId: true},
    });
    return board?.userId === userId;
  }

  private async isColumnOwner(
    entityId: number,
    userId: number
  ): Promise<boolean> {
    const column = await this.prisma.column.findUnique({
      where: {id: entityId},
      select: {
        board: {
          select: {userId: true},
        },
      },
    });
    return column?.board.userId === userId;
  }

  private async isCardOwner(
    entityId: number,
    userId: number
  ): Promise<boolean> {
    const card = await this.prisma.card.findUnique({
      where: {id: entityId},
      select: {
        column: {
          select: {
            board: {
              select: {userId: true},
            },
          },
        },
      },
    });
    return card?.column.board.userId === userId;
  }

  private async isCommentOwner(
    entityId: number,
    userId: number
  ): Promise<boolean> {
    const comment = await this.prisma.comment.findUnique({
      where: {id: entityId},
      select: {userId: true},
    });
    return comment?.userId === userId;
  }
}
