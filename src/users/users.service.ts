import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { User } from '../types-and-interfaces';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { randomUUID } from 'crypto';
import { db } from '../data-base/data-base';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
class UsersService {
  private users: Record<string, User>;

  constructor(private readonly prisma: PrismaService) {
    this.users = db.users;
  }

  findAll(): Omit<User, 'password'>[] {
    console.log('FIND ALL USERS');
    return Object.values(this.users).map((user) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...rest } = user;
      return rest;
    });
  }

  create(createUserDto: CreateUserDto): Omit<User, 'password'> {
    const exists = Object.values(this.users).find((user) => {
      return user.login === createUserDto.login;
    });

    if (exists) {
      throw new BadRequestException('Login already exists');
    }

    const now = Date.now();
    const user: User = {
      id: randomUUID(),
      ...createUserDto,
      version: 1,
      createdAt: now,
      updatedAt: now,
    };

    this.users[user.id] = user;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = user;

    return rest;
  }

  findOne(id: string): Omit<User, 'password'> {
    const user = this.users[id];

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = user;

    return rest;
  }

  #findOneWithPassword(id: string): User {
    const user = this.users[id];

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  update(id: string, updateUserDto: UpdateUserDto): Omit<User, 'password'> {
    const user = this.#findOneWithPassword(id);

    if (user.password !== updateUserDto.oldPassword) {
      throw new ForbiddenException('Old password is incorrect');
    }

    user.password = updateUserDto.newPassword;
    user.version++;
    user.updatedAt = Date.now();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = user;

    return rest;
  }

  remove(id: string): void {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const user = this.#findOneWithPassword(id);

    delete this.users[id];
  }
}

export { UsersService };
