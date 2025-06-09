import { Injectable, NotFoundException } from '@nestjs/common';
import { Album } from '@prisma/client';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
class AlbumsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Album[]> {
    const albums = await this.prisma.album.findMany();
    return albums;
  }

  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    const album: Album = {
      id: randomUUID(),
      ...createAlbumDto,
    };

    const newAlbum = await this.prisma.album.create({
      data: album,
    });

    return newAlbum;
  }

  async findOne(id: string): Promise<Album> {
    const album = await this.prisma.album.findUnique({
      where: { id },
    });

    if (!album) {
      throw new NotFoundException('Album not found');
    }

    return album;
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<Album> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const album = await this.findOne(id);

    const updatedAlbum = await this.prisma.album.update({
      data: updateAlbumDto,
      where: { id },
    });

    return updatedAlbum;
  }

  async remove(id: string): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const album = await this.findOne(id);

    await this.prisma.album.delete({ where: { id } });
  }
}

export { AlbumsService };
