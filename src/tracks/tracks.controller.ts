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
import { TracksService } from './tracks.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';

@Controller('track')
class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  @Get()
  async findAll() {
    const result = await this.tracksService.findAll();
    return result;
  }

  @Post()
  async create(@Body() createTrackDto: CreateTrackDto) {
    const result = await this.tracksService.create(createTrackDto);
    return result;
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    const result = await this.tracksService.findOne(id);
    return result;
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateTrackDto: UpdateTrackDto,
  ) {
    const result = await this.tracksService.update(id, updateTrackDto);
    return result;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.tracksService.remove(id);
  }
}

export { TracksController };
