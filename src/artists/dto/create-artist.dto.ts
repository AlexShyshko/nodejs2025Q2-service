import { IsString, IsBoolean } from 'class-validator';
import { CreateArtistDto as CreateArtistDtoInterface } from '../../types-and-interfaces';

class CreateArtistDto implements CreateArtistDtoInterface {
  @IsString()
  name: string;

  @IsBoolean()
  grammy: boolean;
}

export { CreateArtistDto };
