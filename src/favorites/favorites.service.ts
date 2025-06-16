import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import {
  Artist,
  Album,
  Track,
  FavoritesResponse,
} from '../types-and-interfaces';
import { Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<FavoritesResponse> {
    const response = {
      artists: [],
      albums: [],
      tracks: [],
    } as FavoritesResponse;

    response.artists = (await this.#getAllFavoritesForEntity(
      'artist',
      'artistId',
    )) as Artist[];

    response.albums = (await this.#getAllFavoritesForEntity(
      'album',
      'albumId',
    )) as Album[];

    response.tracks = (await this.#getAllFavoritesForEntity(
      'track',
      'trackId',
    )) as Track[];

    return response;
  }

  async #getAllFavoritesForEntity(
    entityTableName: string,
    entityRelationField: string,
  ): Promise<Artist[] | Album[] | Track[]> {
    const entityFavs = await this.prisma.favorite.findMany({
      select: {
        [entityRelationField]: true,
      },
      where: {
        [entityRelationField]: {
          not: null,
        },
      },
    });
    const entityId = entityFavs.map((favorite) => {
      return favorite[entityRelationField];
    });
    return await this.prisma[entityTableName].findMany({
      where: {
        id: {
          in: entityId,
        },
      },
    });
  }

  async #getFavoriteEntity(
    entityTableName: string,
    entityRelationField: string,
    entityValue: string,
  ) {
    const entity = await this.prisma[entityTableName].findUnique({
      where: { [entityRelationField]: entityValue },
    });

    return entity;
  }

  async #setFavoriteEntity(entityRelationField: string, entityValue: string) {
    const data = {
      id: randomUUID(),
      [entityRelationField]: entityValue,
    } as unknown as Prisma.FavoriteCreateInput;
    await this.prisma.favorite.create({ data: data });
  }

  async addArtist(id: string) {
    const artist = await this.#getFavoriteEntity('artist', 'id', id);
    const artistFavorite = await this.#getFavoriteEntity(
      'favorite',
      'artistId',
      id,
    );

    if (artist && !artistFavorite) {
      await this.#setFavoriteEntity('artistId', id);
    } else if (!artist) {
      throw new UnprocessableEntityException(
        `Entity with ID ${id} not found in "artist"`,
      );
    }

    return artist;
  }

  async deleteArtist(id: string) {
    const artistFavorite = await this.#getFavoriteEntity(
      'favorite',
      'artistId',
      id,
    );

    if (!artistFavorite) {
      throw new UnprocessableEntityException(
        `Favorite with artist ID ${id} not found`,
      );
    }

    await this.prisma.favorite.delete({ where: { artistId: id } });

    return undefined;
  }

  async addAlbum(id: string) {
    const album = await this.#getFavoriteEntity('album', 'id', id);
    const albumFavorite = await this.#getFavoriteEntity(
      'favorite',
      'albumId',
      id,
    );

    if (album && !albumFavorite) {
      await this.#setFavoriteEntity('albumId', id);
    } else if (!album) {
      throw new UnprocessableEntityException(
        `Entity with ID ${id} not found in "album"`,
      );
    }

    return album;
  }

  async deleteAlbum(id: string) {
    const albumFavorite = await this.#getFavoriteEntity(
      'favorite',
      'albumId',
      id,
    );

    if (!albumFavorite) {
      throw new UnprocessableEntityException(
        `Favorite with album ID ${id} not found`,
      );
    }

    await this.prisma.favorite.delete({ where: { albumId: id } });

    return undefined;
  }

  async addTrack(id: string) {
    const track = await this.#getFavoriteEntity('track', 'id', id);
    const trackFavorite = await this.#getFavoriteEntity(
      'favorite',
      'trackId',
      id,
    );

    if (track && !trackFavorite) {
      await this.#setFavoriteEntity('trackId', id);
    } else if (!track) {
      throw new UnprocessableEntityException(
        `Entity with ID ${id} not found in "track"`,
      );
    }

    return track;
  }

  async deleteTrack(id: string) {
    const trackFavorite = await this.#getFavoriteEntity(
      'favorite',
      'trackId',
      id,
    );

    if (!trackFavorite) {
      throw new UnprocessableEntityException(
        `Favorite with track ID ${id} not found`,
      );
    }

    await this.prisma.favorite.delete({ where: { trackId: id } });

    return undefined;
  }
}

export { FavoritesService };
