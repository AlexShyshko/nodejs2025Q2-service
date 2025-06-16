import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  UnauthorizedException,
} from '@nestjs/common';
import { RefreshTokenDto } from '../dto/token.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class UnauthorizedValidationPipe implements PipeTransform {
  async transform(value: RefreshTokenDto, metadata: ArgumentMetadata) {
    const { metatype } = metadata;

    if (!metatype) {
      return value;
    }

    const object = plainToInstance(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      throw new UnauthorizedException('Refresh token is missing or invalid');
    }

    return value;
  }
}
