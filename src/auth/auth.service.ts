import { Injectable, ForbiddenException } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { RefreshTokenDto, AllTokensDto } from './dto/token.dto';
import { TokenPayloadDto } from './dto/token-payload.dto';
import { User as UserReturn } from '../types-and-interfaces';
import * as bcrypt from 'bcrypt';
import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';

@Injectable()
class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signupUser(
    createUserDto: CreateUserDto,
  ): Promise<Omit<UserReturn, 'password'>> {
    const result = await this.usersService.create(createUserDto);
    return result;
  }

  async loginUser(loginUserDto: CreateUserDto): Promise<AllTokensDto> {
    const user = await this.usersService.getUserForLogin(loginUserDto.login);
    const isPasswordMatch = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );

    if (!isPasswordMatch) {
      throw new ForbiddenException(
        `Password ${loginUserDto.password} doesn't match the actual one`,
      );
    }

    const result = this.getAllTokens(user.id, user.login);
    return result;
  }

  refreshToken(refreshTokenDto: RefreshTokenDto): AllTokensDto {
    const jwtVerifyOptions: JwtVerifyOptions = {
      secret: process.env.JWT_SECRET_REFRESH_KEY,
    };

    try {
      const verificationResult = this.jwtService.verify(
        refreshTokenDto.refreshToken,
        jwtVerifyOptions,
      );
      const result = this.getAllTokens(
        verificationResult.userId,
        verificationResult.login,
      );
      return result;
    } catch (error) {
      throw new ForbiddenException('Refresh token is invalid or expired');
    }
  }

  getAllTokens(userId: string, login: string): AllTokensDto {
    const jwtSignPayload: TokenPayloadDto = {
      userId: userId,
      login: login,
    };
    const jwtAccessOptions: JwtSignOptions = {
      secret: process.env.JWT_SECRET_KEY,
      expiresIn: process.env.TOKEN_EXPIRE_TIME,
    };
    const jwtRefreshOptions: JwtSignOptions = {
      secret: process.env.JWT_SECRET_REFRESH_KEY,
      expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
    };
    const accessToken = this.jwtService.sign(jwtSignPayload, jwtAccessOptions);
    const refreshToken = this.jwtService.sign(
      jwtSignPayload,
      jwtRefreshOptions,
    );
    const result: AllTokensDto = {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
    return result;
  }
}

export { AuthService };
