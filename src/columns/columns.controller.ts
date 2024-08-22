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

import {OwnershipGuard} from '../auth/guards/ownership.guard';
import {CheckOwnership} from '../auth/decorators/ownership';
import {ColumnsService} from './columns.service';
import {CreateColumnDTO, CreateColumnResultDTO} from './dtos/create-column.dto';
import {GetAllColumnsResultDTO} from './dtos/get-all-columns.dto';
import {GetColumnByIdResultDTO} from './dtos/get-column-by-id.dto';
import {UpdateColumnDTO, UpdateColumnResultDTO} from './dtos/update-column.dto';
import {Column} from '@prisma/client';
import {AuthGuard} from '../auth/guards/auth.guard';
import {ApiBearerAuth, ApiTags} from '@nestjs/swagger';

@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiTags('Columns')
@Controller('columns')
export class ColumnsController {
  constructor(private readonly columnsService: ColumnsService) {}

  @Post()
  create(
    @Body() createColumnDTO: CreateColumnDTO
  ): Promise<CreateColumnResultDTO> {
    return this.columnsService.create(createColumnDTO);
  }

  @Get()
  findAll(): Promise<GetAllColumnsResultDTO> {
    return this.columnsService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: number): Promise<GetColumnByIdResultDTO | null> {
    return this.columnsService.getById(id);
  }
  @Put(':id')
  @UseGuards(OwnershipGuard)
  @CheckOwnership('column')
  update(
    @Param('id') id: number,
    @Body() data: UpdateColumnDTO
  ): Promise<UpdateColumnResultDTO> {
    return this.columnsService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(OwnershipGuard)
  @CheckOwnership('column')
  delete(@Param('id') id: number): Promise<Column> {
    return this.columnsService.delete(id);
  }
}
