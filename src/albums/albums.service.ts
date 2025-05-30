import { Injectable, NotFoundException } from '@nestjs/common';
import { Favorites, Artist, Album, Track } from '../types-and-interfaces';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { randomUUID } from 'crypto';
import { db } from '../data-base/data-base';

@Injectable()
class AlbumsService {
  private favorites: Favorites;
  private artists: Record<string, Artist>;
  private albums: Record<string, Album>;
  private tracks: Record<string, Track>;

  constructor() {
    this.favorites = db.favorites;
    this.artists = db.artists;
    this.albums = db.albums;
    this.tracks = db.tracks;
  }

  findAll(): Album[] {
    return Object.values(this.albums);
  }

  create(createAlbumDto: CreateAlbumDto) {
    const album: Album = {
      id: randomUUID(),
      ...createAlbumDto,
    };

    this.albums[album.id] = album;

    return album;
  }

  findOne(id: string) {
    const album = this.albums[id];

    if (!album) {
      throw new NotFoundException('Album not found');
    }

    return album;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const album = this.findOne(id);

    album.name = updateAlbumDto.name;
    album.year = updateAlbumDto.year;
    album.artistId = updateAlbumDto.artistId;

    return album;
  }

  remove(id: string) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const album = this.findOne(id);

    delete this.albums[id];

    this.favorites.albums = this.favorites.albums.filter((albumId) => {
      return albumId !== id;
    });

    Object.values(this.tracks).forEach((track) => {
      if (track.albumId === id) {
        track.albumId = null;
      }
    });
  }
}

export { AlbumsService };
