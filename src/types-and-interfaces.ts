interface DB {
  users: Record<string, User>;
  artists: Record<string, Artist>;
  albums: Record<string, Album>;
  tracks: Record<string, Track>;
  favorites: Record<string, Favorites>;
}
interface User {
  id: string; // uuid v4
  login: string;
  password: string;
  version: number; // integer number, increments on update
  createdAt: number; // timestamp of creation
  updatedAt: number; // timestamp of last update
}
interface Artist {
  id: string; // uuid v4
  name: string;
  grammy: boolean;
}
interface Track {
  id: string; // uuid v4
  name: string;
  artistId: string | null; // refers to Artist
  albumId: string | null; // refers to Album
  duration: number; // integer number
}
interface Album {
  id: string; // uuid v4
  name: string;
  year: number;
  artistId: string | null; // refers to Artist
}
interface Favorites {
  artists: string[]; // favorite artists ids
  albums: string[]; // favorite albums ids
  tracks: string[]; // favorite tracks ids
}
interface CreateUserDto {
  login: string;
  password: string;
}
interface UpdatePasswordDto {
  oldPassword: string; // previous password
  newPassword: string; // new password
}
interface FavoritesResponse {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}
export {
  DB,
  User,
  Artist,
  Track,
  Album,
  Favorites,
  CreateUserDto,
  UpdatePasswordDto,
  FavoritesResponse,
};
