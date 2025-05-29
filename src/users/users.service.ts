import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { User } from '../types-and-interfaces';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { randomUUID } from 'crypto';
import { db } from '../data-base/data-base';

@Injectable()
class UsersService {
  private users: Record<string, User>;

  constructor() {
    this.users = db.users;
  }

  create(dto: CreateUserDto): Omit<User, 'password'> {
    const exists = Object.values(this.users).find((user) => {
      return user.login === dto.login;
    });

    if (exists) {
      throw new BadRequestException('Login already exists');
    }

    const now = Date.now();
    const user: User = {
      id: randomUUID(),
      login: dto.login,
      password: dto.password,
      version: 1,
      createdAt: now,
      updatedAt: now,
    };

    this.users[user.id] = user;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = user;
    return rest;
  }

  findAll(): Omit<User, 'password'>[] {
    return Object.values(this.users).map((user) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...rest } = user;
      return rest;
    });
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

  updatePassword(id: string, dto: UpdatePasswordDto): Omit<User, 'password'> {
    const user = this.users[id];

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.password !== dto.oldPassword) {
      throw new ForbiddenException('Old password is incorrect');
    }

    user.password = dto.newPassword;
    user.version++;
    user.updatedAt = Date.now();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = user;
    return rest;
  }

  remove(id: string): void {
    const user = this.users[id];

    if (!user) {
      throw new NotFoundException('User not found');
    }

    delete this.users[id];
  }
}

export { UsersService };
