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
import {CommentsService} from './comments.service';
import {OwnershipGuard} from '../auth/guards/ownership.guard';
import {CheckOwnership} from '../auth/decorators/ownership';
import {
  CreateCommentDTO,
  CreateCommentResultDTO,
} from './dtos/create-comment.dto';
import {GetAccessTokenPayload} from '../auth/decorators/access-token-payload';
import {AccessTokenPayload} from '../auth/types/access-token-payload';
import {GetAllCommentsResultDTO} from './dtos/get-all-comments.dto';
import {GetCommentByIdResultDTO} from './dtos/get-comment-by-id.dto';
import {
  UpdateCommentDTO,
  UpdateCommentResultDTO,
} from './dtos/update-comment.dto';
import {AuthGuard} from '../auth/guards/auth.guard';
import {ApiBearerAuth, ApiTags} from '@nestjs/swagger';

@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(
    @Body() createCommentDTO: CreateCommentDTO,
    @GetAccessTokenPayload() accessTokenPayload: AccessTokenPayload
  ): Promise<CreateCommentResultDTO> {
    return this.commentsService.create(createCommentDTO, accessTokenPayload);
  }

  @Get()
  findAll(): Promise<GetAllCommentsResultDTO> {
    return this.commentsService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: number): Promise<GetCommentByIdResultDTO | null> {
    return this.commentsService.getById(id);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() data: UpdateCommentDTO,
    @GetAccessTokenPayload() accessTokenPayload: AccessTokenPayload
  ): Promise<UpdateCommentResultDTO> {
    return this.commentsService.update(id, data, accessTokenPayload);
  }

  @Delete(':id')
  @UseGuards(OwnershipGuard)
  @CheckOwnership('comment')
  delete(@Param('id') id: number) {
    return this.commentsService.delete(id);
  }
}
