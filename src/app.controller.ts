import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
// import { User, Artist, Track, Album, Favorites, CreateUserDto, UpdatePasswordDto, FavoritesResponse } from './types-and-interfaces';
// import { mc } from './message-colorizer/message-colorizer';

@Controller()
class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

export { AppController };
