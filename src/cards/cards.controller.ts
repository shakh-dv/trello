import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import {CardsService} from './cards.service';
import {OwnershipGuard} from '../auth/guards/ownership.guard';
import {CheckOwnership} from '../auth/decorators/ownership';
import {Card} from '@prisma/client';
import {CreateCardDTO, CreateCardResultDTO} from './dtos/create-card.dto';
import {GetAllCardsResultDTO} from './dtos/get-all-cards.dto';
import {GetCardByIdResultDTO} from './dtos/get-card-by-id.dto';
import {UpdateCardDTO, UpdateCardResultDTO} from './dtos/update-card.dto';
import {AuthGuard} from '../auth/guards/auth.guard';
import {ApiBearerAuth, ApiTags} from '@nestjs/swagger';

@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiTags('Cards')
@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  create(@Body() createCardDTO: CreateCardDTO): Promise<CreateCardResultDTO> {
    return this.cardsService.create(createCardDTO);
  }

  @Get()
  findAll(): Promise<GetAllCardsResultDTO> {
    return this.cardsService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: number): Promise<GetCardByIdResultDTO | null> {
    return this.cardsService.getById(id);
  }
  @Put(':id')
  @UseGuards(OwnershipGuard)
  @CheckOwnership('card')
  update(
    @Param('id') id: number,
    @Body() data: UpdateCardDTO
  ): Promise<UpdateCardResultDTO> {
    return this.cardsService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(OwnershipGuard)
  @CheckOwnership('card')
  delete(@Param('id') id: number): Promise<Card> {
    return this.cardsService.delete(id);
  }
}
