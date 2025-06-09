import { Injectable, NotFoundException } from '@nestjs/common';
import { Artist } from '@prisma/client';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
class ArtistsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Artist[]> {
    const artists = await this.prisma.artist.findMany();
    return artists;
  }

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    const artist: Artist = {
      id: randomUUID(),
      ...createArtistDto,
    };

    const newArtist = await this.prisma.artist.create({
      data: artist,
    });

    return newArtist;
  }

  async findOne(id: string): Promise<Artist> {
    const artist = await this.prisma.artist.findUnique({
      where: { id },
    });

    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    return artist;
  }

  async update(id: string, updateArtistDto: UpdateArtistDto): Promise<Artist> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const artist = await this.findOne(id);

    const updatedArtist = await this.prisma.artist.update({
      data: updateArtistDto,
      where: { id },
    });

    return updatedArtist;
  }

  async remove(id: string): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const artist = await this.findOne(id);

    await this.prisma.artist.delete({ where: { id } });
  }
}

export { ArtistsService };
