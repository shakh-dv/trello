import {Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from '../core/infra/prisma/prisma.service';
import {Card} from '@prisma/client';
import {UpdateCardDTO} from './dtos/update-card.dto';
import {GetCardByIdResultDTO} from './dtos/get-card-by-id.dto';
import {CreateCardDTO, CreateCardResultDTO} from './dtos/create-card.dto';
import {GetAllCardsResultDTO} from './dtos/get-all-cards.dto';

@Injectable()
export class CardsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: CreateCardDTO): Promise<CreateCardResultDTO> {
    return this.prismaService.card.create({
      data: {
        title: data.title,
        description: data.description,
        columnId: data.columnId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        columnId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  getAll(): Promise<GetAllCardsResultDTO> {
    return this.prismaService.card.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        columnId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  getById(cardId: number): Promise<GetCardByIdResultDTO> {
    return this.prismaService.card.findFirst({
      where: {
        id: Number(cardId),
      },
      select: {
        id: true,
        title: true,
        description: true,
        columnId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async getByIdOrThrow(cardId: number): Promise<Card> {
    const card = await this.prismaService.card.findUnique({
      where: {
        id: Number(cardId),
      },
    });

    if (!card) {
      throw new NotFoundException('Card not found');
    }

    return card;
  }

  async update(cardId: number, data: UpdateCardDTO) {
    await this.getByIdOrThrow(cardId);

    return this.prismaService.card.update({
      where: {
        id: Number(cardId),
      },
      data: {
        title: data.title,
        description: data.description,
        columnId: data.columnId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        columnId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async delete(cardId: number) {
    await this.getByIdOrThrow(cardId);

    return this.prismaService.card.delete({
      where: {
        id: Number(cardId),
      },
      select: {
        id: true,
        title: true,
        description: true,
        columnId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
