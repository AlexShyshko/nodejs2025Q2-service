import { Injectable, NotFoundException } from '@nestjs/common';
import { Favorites, Artist, Album, Track } from '../types-and-interfaces';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { randomUUID } from 'crypto';
import { db } from '../data-base/data-base';

@Injectable()
export class ArtistsService {
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

  findAll(): Artist[] {
    return Object.values(this.artists);
  }

  create(createArtistDto: CreateArtistDto) {
    const artist: Artist = {
      id: randomUUID(),
      ...createArtistDto,
    };

    this.artists[artist.id] = artist;

    return artist;
  }

  findOne(id: string) {
    const artist = this.artists[id];

    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    return artist;
  }

  update(id: string, updateArtistDto: UpdateArtistDto) {
    const artist = this.artists[id];

    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    artist.name = updateArtistDto.name;
    artist.grammy = updateArtistDto.grammy;

    return artist;
  }

  remove(id: string) {
    const artist = this.artists[id];

    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    delete this.artists[id];
    this.favorites.artists = this.favorites.artists.filter((artisId) => {
      return artisId !== id;
    });
    Object.values(this.albums).forEach((album) => {
      if (album.artistId === id) {
        album.artistId = null;
      }
    });
    Object.values(this.tracks).forEach((track) => {
      if (track.artistId === id) {
        track.artistId = null;
      }
    });
  }
}
