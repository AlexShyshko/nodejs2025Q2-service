import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Controller('album')
class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Get()
  async findAll() {
    const result = await this.albumsService.findAll();
    return result;
  }

  @Post()
  async create(@Body() createAlbumDto: CreateAlbumDto) {
    const result = await this.albumsService.create(createAlbumDto);
    return result;
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    const result = await this.albumsService.findOne(id);
    return result;
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ) {
    const result = await this.albumsService.update(id, updateAlbumDto);
    return result;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.albumsService.remove(id);
  }
}

export { AlbumsController };
