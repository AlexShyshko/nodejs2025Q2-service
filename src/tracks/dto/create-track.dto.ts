import { IsString, IsNumber, IsOptional } from 'class-validator';
import { CreateTrackDto as CreateTrackDtoInterface } from '../../types-and-interfaces';

class CreateTrackDto implements CreateTrackDtoInterface {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  artistId: string | null;

  @IsString()
  @IsOptional()
  albumId: string | null;

  @IsNumber()
  duration: number;
}

export { CreateTrackDto };
