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
import {BoardsService} from './boards.service';
import {CreateBoardDTO, CreateBoardResultDTO} from './dtos/create-board.dto';
import {GetAllBoardsResultDTO} from './dtos/get-all-boards.dto';
import {UpdateBoardDTO, UpdateBoardResultDTO} from './dtos/update-board.dto';
import {ApiBearerAuth, ApiTags} from '@nestjs/swagger';
import {AuthGuard} from '../auth/guards/auth.guard';
import {AccessTokenPayload} from '../auth/types/access-token-payload';
import {GetAccessTokenPayload} from '../auth/decorators/access-token-payload';
import {GetBoardByIdResultDTO} from './dtos/get-board-by-id.dto';
import {OwnershipGuard} from '../auth/guards/ownership.guard';
import {CheckOwnership} from '../auth/decorators/ownership';
import {Board} from '@prisma/client';

@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiTags('Boards')
@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Post()
  create(
    @Body() createBoardDTO: CreateBoardDTO,
    @GetAccessTokenPayload() accessTokenPayload: AccessTokenPayload
  ): Promise<CreateBoardResultDTO> {
    return this.boardsService.create(createBoardDTO, accessTokenPayload);
  }

  @Get()
  findAll(
    @GetAccessTokenPayload() accessTokenPayload: AccessTokenPayload
  ): Promise<GetAllBoardsResultDTO> {
    return this.boardsService.getAll(accessTokenPayload);
  }

  @Get(':userId/user')
  async getBoardsForUser(@Param('userId') userId: number): Promise<Board[]> {
    return this.boardsService.getForUser(userId);
  }

  @Get(':id')
  getById(@Param('id') id: number): Promise<GetBoardByIdResultDTO | null> {
    return this.boardsService.getById(id);
  }

  @Get(':boardId/users/:userId')
  getBoard(
    @Param('userId') userId: number,
    @Param('boardId') boardId: number
  ): Promise<GetBoardByIdResultDTO | null> {
    return this.boardsService.getBoard(userId, boardId);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() data: UpdateBoardDTO,
    @GetAccessTokenPayload() accessTokenPayload: AccessTokenPayload
  ): Promise<UpdateBoardResultDTO> {
    return this.boardsService.update(id, data, accessTokenPayload);
  }

  @Delete(':id')
  @UseGuards(OwnershipGuard)
  @CheckOwnership('board')
  delete(@Param('id') id: number) {
    return this.boardsService.delete(id);
  }
}
