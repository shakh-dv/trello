import {Injectable, NotFoundException} from '@nestjs/common';

import {PrismaService} from '../core/infra/prisma/prisma.service';
import {CreateColumnDTO, CreateColumnResultDTO} from './dtos/create-column.dto';
import {UpdateColumnDTO} from './dtos/update-column.dto';
import {GetColumnByIdResultDTO} from './dtos/get-column-by-id.dto';
import {Column} from '@prisma/client';
import {GetAllColumnsResultDTO} from './dtos/get-all-columns.dto';

@Injectable()
export class ColumnsService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(data: CreateColumnDTO): Promise<CreateColumnResultDTO> {
    return this.prismaService.column.create({
      data: {
        name: data.name,
        boardId: data.boardId,
      },
      select: {
        id: true,
        name: true,
        boardId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  getAll(): Promise<GetAllColumnsResultDTO> {
    return this.prismaService.column.findMany({
      select: {
        id: true,
        name: true,
        boardId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  getById(columnId: number): Promise<GetColumnByIdResultDTO> {
    return this.prismaService.column.findFirst({
      where: {
        id: Number(columnId),
      },
      select: {
        id: true,
        name: true,
        boardId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async getByIdOrThrow(columnId: number): Promise<Column> {
    const column = await this.prismaService.column.findUnique({
      where: {
        id: Number(columnId),
      },
    });

    if (!column) {
      throw new NotFoundException('Column not found');
    }

    return column;
  }

  async update(columnId: number, data: UpdateColumnDTO) {
    await this.getByIdOrThrow(columnId);

    return this.prismaService.column.update({
      where: {
        id: Number(columnId),
      },
      data: {
        name: data.name,
        boardId: data.boardId,
      },
      select: {
        id: true,
        name: true,
        boardId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async delete(columnId: number) {
    await this.getByIdOrThrow(columnId);

    return this.prismaService.column.delete({
      where: {
        id: Number(columnId),
      },
      select: {
        id: true,
        name: true,
        boardId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
