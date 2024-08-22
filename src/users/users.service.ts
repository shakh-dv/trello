import {ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from '../core/infra/prisma/prisma.service';
import {CreateUserDTO} from './dtos/create-user.dto';
import {User} from '@prisma/client';
import {GetUserByIdResultDTO} from './dtos/get-user-by-id.dto';
import {UpdateUserDTO} from './dtos/update-user.dto';
import {GetAllUsersResultDTO} from './dtos/get-all-users.dto';
import {AuthService} from '../auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly authService: AuthService
  ) {}

  async create(data: CreateUserDTO) {
    const {username, email, password} = data;

    const foundUser = await this.getByEmail(email);

    if (foundUser) {
      throw new ConflictException('User already exists');
    }

    return this.prismaService.user.create({
      data: {
        username,
        email,
        password: await this.authService.generateHashPassword(password),
      },
      select: {
        id: true,
        username: true,
        email: true,
        password: false,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  getAll(): Promise<GetAllUsersResultDTO> {
    return this.prismaService.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        password: false,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {createdAt: 'desc'},
    });
  }

  getById(userId: number): Promise<GetUserByIdResultDTO> {
    return this.prismaService.user.findFirst({
      where: {
        id: Number(userId),
      },
      select: {
        id: true,
        username: true,
        email: true,
        password: false,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async getByIdOrThrow(userId: number): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: Number(userId),
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  getByEmail(email: string): Promise<User | null> {
    return this.prismaService.user.findFirst({
      where: {
        email,
      },
    });
  }

  async update(userId: number, data: UpdateUserDTO) {
    const {username, email} = data;

    await this.getByIdOrThrow(userId);

    return this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        username,
        email,
      },
      select: {
        id: true,
        username: true,
        email: true,
        password: false,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async delete(userId: number) {
    await this.getByIdOrThrow(userId);
    return this.prismaService.user.delete({
      where: {
        id: Number(userId),
      },
    });
  }

  async updatePassword(userId: number, password: string): Promise<void> {
    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        password,
      },
    });
  }
}
