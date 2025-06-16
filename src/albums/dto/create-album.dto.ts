import { IsString, IsNumber, IsOptional } from 'class-validator';
import { CreateAlbumDto as CreateAlbumDtoInterface } from '../../types-and-interfaces';

class CreateAlbumDto implements CreateAlbumDtoInterface {
  @IsString()
  name: string;

  @IsNumber()
  year: number;

  @IsString()
  @IsOptional()
  artistId: string | null;
}

export { CreateAlbumDto };
