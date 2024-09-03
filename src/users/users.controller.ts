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
import {UsersService} from './users.service';
import {CreateUserDTO, CreateUserResultDTO} from './dtos/create-user.dto';
import {UpdateUserDTO, UpdateUserResultDTO} from './dtos/update-user.dto';
import {GetAllUsersResultDTO} from './dtos/get-all-users.dto';
import {CommentsService} from '../comments/comments.service';
import {Comment} from '@prisma/client';
import {JwtAuthGuard} from '../auth/guards/jwt.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
// @UseGuards(AuthGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly commentsService: CommentsService
  ) {}

  @Post()
  create(@Body() createUserDTO: CreateUserDTO): Promise<CreateUserResultDTO> {
    return this.usersService.create(createUserDTO);
  }

  @Get()
  findAll(): Promise<GetAllUsersResultDTO> {
    return this.usersService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: number) {
    return this.usersService.getById(id);
  }

  @Get(':userId/cards/:cardId/comments')
  async getCommentsForCard(
    @Param('userId') userId: number,
    @Param('cardId') cardId: number
  ): Promise<Comment[]> {
    return this.commentsService.getComments(userId, cardId);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() data: UpdateUserDTO
  ): Promise<UpdateUserResultDTO> {
    return this.usersService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.usersService.delete(id);
  }
}
