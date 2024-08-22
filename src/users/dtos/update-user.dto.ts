import {PartialType} from '@nestjs/swagger';
import {CreateUserDTO} from './create-user.dto';
import {User} from '@prisma/client';

export class UpdateUserDTO extends PartialType(CreateUserDTO) {}

export type UpdateUserResultDTO = Omit<User, 'password'>;
