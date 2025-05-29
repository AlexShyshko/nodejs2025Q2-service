import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Users } from './users/users.module';
// import { User, Artist, Track, Album, Favorites, CreateUserDto, UpdatePasswordDto, FavoritesResponse } from './types-and-interfaces';
// import { mc } from './message-colorizer/message-colorizer';

@Module({
  imports: [Users],
  controllers: [AppController],
  providers: [AppService],
})
class AppModule {}

export { AppModule };
