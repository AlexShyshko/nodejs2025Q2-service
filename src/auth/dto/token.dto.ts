import { IsString } from 'class-validator';
import {
  RefreshTokenDto as RefreshTokenDtoInterface,
  AllTokensDto as AllTokensDtoInterface,
} from '../../types-and-interfaces';

class RefreshTokenDto implements RefreshTokenDtoInterface {
  @IsString()
  refreshToken: string;
}

class AllTokensDto extends RefreshTokenDto implements AllTokensDtoInterface {
  @IsString()
  accessToken: string;
}

export { RefreshTokenDto, AllTokensDto };
