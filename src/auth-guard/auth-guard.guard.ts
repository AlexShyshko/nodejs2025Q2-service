import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

@Injectable()
class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      process.env.IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const [authorizationType, authorizationValue] =
      request.headers.authorization?.split(' ') ?? [];

    if (authorizationType !== 'Bearer' || !authorizationValue) {
      throw new UnauthorizedException('Access token is missing or invalid');
    }

    const jwtVerifyOptions: JwtVerifyOptions = {
      secret: process.env.JWT_SECRET_KEY,
    };
    try {
      const verificationResult = this.jwtService.verify(
        authorizationValue,
        jwtVerifyOptions,
      );
      request.user = verificationResult;

      return true;
    } catch (error) {
      throw new ForbiddenException('Refresh token is invalid or expired');
    }
  }
}

export { AuthGuard };
