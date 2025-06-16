import { Injectable, NotFoundException } from '@nestjs/common';
import { Track } from '@prisma/client';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
class TracksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Track[]> {
    const tracks = await this.prisma.track.findMany();
    return tracks;
  }

  async create(createTrackDto: CreateTrackDto): Promise<Track> {
    const track: Track = {
      id: randomUUID(),
      ...createTrackDto,
    };

    const newTrack = await this.prisma.track.create({
      data: track,
    });

    return newTrack;
  }

  async findOne(id: string): Promise<Track> {
    const track = await this.prisma.track.findUnique({
      where: { id },
    });

    if (!track) {
      throw new NotFoundException('Track not found');
    }

    return track;
  }

  async update(id: string, updateTrackDto: UpdateTrackDto): Promise<Track> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const track = await this.findOne(id);

    const updatedTrack = await this.prisma.track.update({
      data: updateTrackDto,
      where: { id },
    });

    return updatedTrack;
  }

  async remove(id: string): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const track = await this.findOne(id);

    await this.prisma.track.delete({ where: { id } });
  }
}

export { TracksService };
