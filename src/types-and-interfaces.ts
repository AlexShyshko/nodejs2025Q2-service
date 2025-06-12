interface DB {
  users: Record<string, User>;
  artists: Record<string, Artist>;
  albums: Record<string, Album>;
  tracks: Record<string, Track>;
  favorites: Favorites;
}
interface User {
  id: string; // uuid v4
  login: string;
  password: string;
  version: number; // integer number, increments on update
  createdAt: number; // timestamp of creation
  updatedAt: number; // timestamp of last update
}
interface CreateUserDto
  extends Omit<User, 'id' | 'version' | 'createdAt' | 'updatedAt'> {}
interface UpdateUserDto {
  oldPassword: string; // previous password
  newPassword: string; // new password
}
interface Artist {
  id: string; // uuid v4
  name: string;
  grammy: boolean;
}
interface CreateArtistDto extends Omit<Artist, 'id'> {}
interface UpdateArtistDto extends CreateArtistDto {}
interface Track {
  id: string; // uuid v4
  name: string;
  artistId: string | null; // refers to Artist
  albumId: string | null; // refers to Album
  duration: number; // integer number
}
interface CreateTrackDto extends Omit<Track, 'id'> {}
interface UpdateTrackDto extends CreateTrackDto {}
interface Album {
  id: string; // uuid v4
  name: string;
  year: number;
  artistId: string | null; // refers to Artist
}
interface CreateAlbumDto extends Omit<Album, 'id'> {}
interface UpdateAlbumDto extends Omit<Album, 'id'> {}
interface Favorites {
  artists: string[]; // favorite artists ids
  albums: string[]; // favorite albums ids
  tracks: string[]; // favorite tracks ids
}
interface FavoritesResponse {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}
interface RefreshTokenDto {
  refreshToken: string;
}
interface AllTokensDto extends RefreshTokenDto {
  accessToken: string;
}
interface TokenPayloadDto {
  userId: string;
  login: string;
}
export {
  DB,
  User,
  CreateUserDto,
  UpdateUserDto,
  Artist,
  CreateArtistDto,
  UpdateArtistDto,
  Track,
  CreateTrackDto,
  UpdateTrackDto,
  Album,
  CreateAlbumDto,
  UpdateAlbumDto,
  Favorites,
  FavoritesResponse,
  RefreshTokenDto,
  AllTokensDto,
  TokenPayloadDto,
};
