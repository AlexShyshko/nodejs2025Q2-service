import { IsString, IsNumber, IsOptional } from 'class-validator';
import { UpdateAlbumDto as UpdateAlbumDtoInterface } from '../../types-and-interfaces';

class UpdateAlbumDto implements UpdateAlbumDtoInterface {
  @IsString()
  name: string;

  @IsNumber()
  year: number;

  @IsString()
  @IsOptional()
  artistId: string | null;
}

export { UpdateAlbumDto };
