import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { RefreshTokenDto } from './dto/token.dto';
import { UnauthorizedValidationPipe } from './pipes/unauthorized-validation.pipe';
import { RawBody } from './decorators/refresh-token.decorator';
import { Public } from '../auth-guard/public.decorator';

@Controller('auth')
class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  async signupUser(@Body() createUserDto: CreateUserDto) {
    return await this.authService.signupUser(createUserDto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async loginUser(@Body() loginUserDto: CreateUserDto) {
    return await this.authService.loginUser(loginUserDto);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshToken(
    @RawBody(new UnauthorizedValidationPipe()) refreshTokenDto: RefreshTokenDto,
  ) {
    return this.authService.refreshToken(refreshTokenDto);
  }
}

export { AuthController };
