import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../auth-guard/auth-guard.guard';

const registerOptions: JwtModuleOptions = {
  secret: process.env.JWT_SECRET_KEY,
  signOptions: { expiresIn: process.env.TOKEN_EXPIRE_TIME },
};
@Module({
  imports: [UsersModule, JwtModule.register(registerOptions)],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
class AuthModule {}

export { AuthModule };
