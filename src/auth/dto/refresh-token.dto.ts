import { IsString } from 'class-validator';
import { RefreshTokenDto as RefreshTokenDtoInterface } from '../../types-and-interfaces';

class RefreshTokenDto implements RefreshTokenDtoInterface {
  @IsString()
  refreshToken: string;
}

export { RefreshTokenDto };
