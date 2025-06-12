import { IsString } from 'class-validator';
import { TokenPayloadDto as TokenPayloadDtoInterface } from '../../types-and-interfaces';

class TokenPayloadDto implements TokenPayloadDtoInterface {
  @IsString()
  userId: string;

  @IsString()
  login: string;
}

export { TokenPayloadDto };
