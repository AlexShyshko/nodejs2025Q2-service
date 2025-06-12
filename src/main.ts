import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
dotenv.config();
import { parse as parseYaml } from 'yaml';
import { join } from 'path';
import { readFile } from 'fs/promises';
import { SwaggerModule } from '@nestjs/swagger';
import { mc } from './message-colorizer/message-colorizer';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const swaggerPath = join(__dirname, '../doc/api.yaml');
  const swaggerConfigString = await readFile(swaggerPath, 'utf-8');
  const swaggerConfigParsed = parseYaml(swaggerConfigString);
  const swaggerRoute = 'doc';
  SwaggerModule.setup(swaggerRoute, app, swaggerConfigParsed);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(process.env.PORT);

  setTimeout(() => {
    const swaggerUrl = swaggerConfigParsed.servers[0].url;
    console.log(
      `${mc.colorize('Swagger is available:', 'green')} ${mc.colorize(swaggerUrl + '/' + swaggerRoute, 'red')}`,
    );
  }, 1000);
}
bootstrap();
