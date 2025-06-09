import { Injectable } from '@nestjs/common';
// import { User, Artist, Track, Album, Favorites, CreateUserDto, UpdatePasswordDto, FavoritesResponse } from './types-and-interfaces';
// import { mc } from './message-colorizer/message-colorizer';

@Injectable()
class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}

export { AppService };
