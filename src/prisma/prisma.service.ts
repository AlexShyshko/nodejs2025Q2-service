import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();

    // this.user.deleteMany();
    // this.artist.deleteMany();
    // this.album.deleteMany();
    // this.track.deleteMany();
    // this.favorite.deleteMany();
  }

  async onModuleDestroy() {
    await this.$disconnect();

    // this.user.deleteMany();
    // this.artist.deleteMany();
    // this.album.deleteMany();
    // this.track.deleteMany();
    // this.favorite.deleteMany();
  }
}

export { PrismaService };
