import {Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from '../core/infra/prisma/prisma.service';
import {Board} from '@prisma/client';
import {CreateBoardDTO, CreateBoardResultDTO} from './dtos/create-board.dto';
import {GetAllBoardsResultDTO} from './dtos/get-all-boards.dto';
import {GetBoardByIdResultDTO} from './dtos/get-board-by-id.dto';
import {UpdateBoardDTO} from './dtos/update-board.dto';
import {AccessTokenPayload} from '../auth/types/access-token-payload';

@Injectable()
export class BoardsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    data: CreateBoardDTO,
    accessTokenPayload: AccessTokenPayload
  ): Promise<CreateBoardResultDTO> {
    return this.prismaService.board.create({
      data: {
        name: data.name,
        userId: accessTokenPayload.userId,
      },
      select: {
        id: true,
        name: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  getAll(
    accessTokenPayload: AccessTokenPayload
  ): Promise<GetAllBoardsResultDTO> {
    return this.prismaService.board.findMany({
      where: {
        userId: accessTokenPayload.userId,
      },
      select: {
        id: true,
        name: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  getById(boardId: number): Promise<GetBoardByIdResultDTO> {
    return this.prismaService.board.findFirst({
      where: {
        id: Number(boardId),
      },
      select: {
        id: true,
        name: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  getBoard(userId: number, boardId: number) {
    return this.prismaService.board.findFirst({
      where: {
        id: Number(boardId),
        userId: Number(userId),
      },
      include: {
        columns: {
          include: {
            cards: true,
          },
        },
      },
    });
  }

  getForUser(userId: number) {
    return this.prismaService.board.findMany({
      where: {
        userId: Number(userId),
      },
      include: {
        columns: {
          include: {
            cards: true,
          },
        },
      },
    });
  }

  async getByIdOrThrow(boardId: number): Promise<Board> {
    const board = await this.prismaService.board.findUnique({
      where: {
        id: Number(boardId),
      },
    });

    if (!board) {
      throw new NotFoundException('Board not found');
    }

    return board;
  }

  async update(
    boardId: number,
    data: UpdateBoardDTO,
    accessTokenPayload: AccessTokenPayload
  ) {
    await this.getByIdOrThrow(boardId);

    return this.prismaService.board.update({
      where: {
        id: Number(boardId),
      },
      data: {
        name: data.name,
        userId: accessTokenPayload.userId,
      },
      select: {
        id: true,
        name: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async delete(boardId: number) {
    await this.getByIdOrThrow(boardId);

    return this.prismaService.board.delete({
      where: {
        id: Number(boardId),
      },
      select: {
        id: true,
        name: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
