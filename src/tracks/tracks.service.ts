import { Injectable, NotFoundException } from '@nestjs/common';
import { Favorites, Track } from '../types-and-interfaces';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { randomUUID } from 'crypto';
import { db } from '../data-base/data-base';

@Injectable()
class TracksService {
  private favorites: Favorites;
  private tracks: Record<string, Track>;

  constructor() {
    this.favorites = db.favorites;
    this.tracks = db.tracks;
  }

  findAll() {
    return Object.values(this.tracks);
  }

  create(createTrackDto: CreateTrackDto) {
    const track: Track = {
      id: randomUUID(),
      ...createTrackDto,
    };

    this.tracks[track.id] = track;

    return track;
  }

  findOne(id: string) {
    const track = this.tracks[id];

    if (!track) {
      throw new NotFoundException('Album not found');
    }

    return track;
  }

  update(id: string, updateTrackDto: UpdateTrackDto) {
    const track = this.findOne(id);

    track.name = updateTrackDto.name;
    track.artistId = updateTrackDto.artistId;
    track.albumId = updateTrackDto.albumId;
    track.duration = updateTrackDto.duration;

    return track;
  }

  remove(id: string) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const track = this.findOne(id);

    delete this.tracks[id];

    this.favorites.tracks = this.favorites.tracks.filter((trackId) => {
      return trackId !== id;
    });
  }
}

export { TracksService };
