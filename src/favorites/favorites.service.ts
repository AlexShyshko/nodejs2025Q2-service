import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import {
  Favorites,
  Artist,
  Album,
  Track,
  FavoritesResponse,
} from '../types-and-interfaces';
import { db } from '../data-base/data-base';

@Injectable()
class FavoritesService {
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

  findAll(): FavoritesResponse {
    const response = {} as FavoritesResponse;
    const favoritesKeys = Object.keys(this.favorites);
    favoritesKeys.forEach((favoritesKey) => {
      response[favoritesKey] = this.favorites[favoritesKey].map((entityId) => {
        return this[favoritesKey][entityId];
      });
    });

    return response;
  }

  #getFavoriteEntity(entityKey: string, entityId: string) {
    const entity = this[entityKey][entityId];

    if (!entity) {
      throw new UnprocessableEntityException(
        `Entity with ID ${entityId} not found in "${entityKey}"`,
      );
    }

    return entity;
  }

  addArtist(id: string) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const artist = this.#getFavoriteEntity('artists', id);

    this.favorites.artists.push(id);
  }

  deleteArtist(id: string) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const artist = this.#getFavoriteEntity('artists', id);

    this.favorites.artists = this.favorites.artists.filter((artistId) => {
      return artistId !== id;
    });

    return undefined;
  }

  addAlbum(id: string) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const album = this.#getFavoriteEntity('albums', id);

    this.favorites.albums.push(id);
  }

  deleteAlbum(id: string) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const album = this.#getFavoriteEntity('albums', id);

    this.favorites.albums = this.favorites.albums.filter((albumId) => {
      return albumId !== id;
    });

    return undefined;
  }

  addTrack(id: string) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const track = this.#getFavoriteEntity('tracks', id);

    this.favorites.tracks.push(id);
  }

  deleteTrack(id: string) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const track = this.#getFavoriteEntity('tracks', id);

    this.favorites.tracks = this.favorites.tracks.filter((trackId) => {
      return trackId !== id;
    });

    return undefined;
  }
}

export { FavoritesService };
