import {User} from '@prisma/client';

export type GetUserByIdResultDTO = Omit<User, 'password'> | null;
