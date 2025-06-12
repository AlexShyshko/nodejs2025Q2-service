import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signupUser(@Body() createUserDto: CreateUserDto) {
    return await this.authService.signupUser(createUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async loginUser(@Body() loginUserDto: CreateUserDto) {
    return await this.authService.loginUser(loginUserDto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return await this.authService.refreshToken(refreshTokenDto);
  }
}

export { AuthController };
