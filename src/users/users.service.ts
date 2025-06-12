import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { User as UserReturn } from '../types-and-interfaces';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Omit<UserReturn, 'password'>[]> {
    const users = await this.prisma.user.findMany();

    return users.map((user) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...rest } = user;
      return {
        ...rest,
        createdAt: rest.createdAt.getTime(),
        updatedAt: rest.updatedAt.getTime(),
      };
    });
  }

  async create(
    createUserDto: CreateUserDto,
  ): Promise<Omit<UserReturn, 'password'>> {
    const userExists = await this.prisma.user.findFirst({
      where: { login: createUserDto.login },
    });

    if (userExists) {
      throw new BadRequestException('Login already exists');
    }

    const now = new Date();
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      Number(process.env.CRYPT_SALT),
    );
    const user: User = {
      id: randomUUID(),
      login: createUserDto.login,
      password: hashedPassword,
      version: 1,
      createdAt: now,
      updatedAt: now,
    };

    const createdUser = await this.prisma.user.create({
      data: user,
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = createdUser;

    return {
      ...rest,
      createdAt: rest.createdAt.getTime(),
      updatedAt: rest.updatedAt.getTime(),
    };
  }

  async findOne(id: string): Promise<Omit<UserReturn, 'password'>> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = user;

    return {
      ...rest,
      createdAt: rest.createdAt.getTime(),
      updatedAt: rest.updatedAt.getTime(),
    };
  }

  async #findOneWithPassword(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<Omit<UserReturn, 'password'>> {
    const user = await this.#findOneWithPassword(id);
    const isPasswordMatch = await bcrypt.compare(
      updateUserDto.oldPassword,
      user.password,
    );

    if (!isPasswordMatch) {
      throw new ForbiddenException(
        `Old password ${updateUserDto.oldPassword} is incorrect`,
      );
    }

    const now = new Date();
    const hashedPassword = await bcrypt.hash(
      updateUserDto.newPassword,
      Number(process.env.CRYPT_SALT),
    );
    const updateData: Omit<User, 'id' | 'login' | 'createdAt'> = {
      password: hashedPassword,
      version: user.version + 1,
      updatedAt: now,
    };

    const updatedUser = await this.prisma.user.update({
      data: updateData,
      where: { id },
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = updatedUser;

    return {
      ...rest,
      createdAt: rest.createdAt.getTime(),
      updatedAt: rest.updatedAt.getTime(),
    };
  }

  async remove(id: string): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const user = await this.#findOneWithPassword(id);

    await this.prisma.user.delete({ where: { id } });
  }

  async getUserForLogin(login: string): Promise<User> {
    const user = await this.prisma.user.findFirst({ where: { login } });

    if (!user) {
      throw new ForbiddenException(`No user with login ${login}`);
    }

    return user;
  }
}

export { UsersService };
