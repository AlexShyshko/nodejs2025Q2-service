import { IsString, IsNumber, IsOptional } from 'class-validator';
import { UpdateTrackDto as UpdateTrackDtoInterface } from '../../types-and-interfaces';

class UpdateTrackDto implements UpdateTrackDtoInterface {
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

export { UpdateTrackDto };
