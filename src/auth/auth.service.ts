import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { User as UserReturn } from '../types-and-interfaces';

@Injectable()
class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async signupUser(
    createUserDto: CreateUserDto,
  ): Promise<Omit<UserReturn, 'password'>> {
    // console.log('createUserDto');
    // console.log(createUserDto);
    const result = await this.usersService.create(createUserDto);
    // console.log('createUserDtoResult');
    // console.log(result);
    return result;
  }

  async loginUser(loginUserDto: CreateUserDto) {
    console.log('loginUserDto');
    console.log(loginUserDto);
    return `loginUser()`;
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    console.log('refreshTokenDto');
    console.log(refreshTokenDto);
    return `refreshToken()`;
  }
}

export { AuthService };
