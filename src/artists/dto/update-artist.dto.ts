import { IsString, IsBoolean } from 'class-validator';
import { UpdateArtistDto as UpdateArtistDtoInterface } from '../../types-and-interfaces';

class UpdateArtistDto implements UpdateArtistDtoInterface {
  @IsString()
  name: string;

  @IsBoolean()
  grammy: boolean;
}

export { UpdateArtistDto };
