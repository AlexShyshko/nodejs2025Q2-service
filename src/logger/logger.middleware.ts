import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from './logger.service';
import { finished } from 'stream';
import { STATUS_CODES } from 'http';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly loggerService: LoggerService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, protocol, hostname, originalUrl, query, body } = req;
    const responseChunks: Buffer[] = [];
    let responseBody: string;

    const originalWrite = res.write.bind(res);
    res.write = (chunk, ...rest) => {
      responseChunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      return originalWrite.call(res, chunk, ...rest);
    };

    const originalEnd = res.end.bind(res);
    res.end = (chunk, ...rest) => {
      if (chunk && typeof chunk !== 'function') {
        responseChunks.push(
          Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk),
        );
      }
      responseBody = Buffer.concat(responseChunks).toString('utf8');
      return originalEnd.call(res, chunk, ...rest);
    };

    finished(res, () => {
      const { statusCode } = res;
      const statusMessage = STATUS_CODES[statusCode];
      const requestUrl = `${protocol}://${hostname}:${process.env.PORT}${originalUrl}`;
      const message = `Request method: ${method}. Request URL: ${requestUrl}. Request query parameters: ${JSON.stringify(query)}. Request body: ${JSON.stringify(body)}. Response status code: ${statusCode}. Response status message: ${statusMessage}. Response Body: ${responseBody}`;

      this.loggerService.log(message);
    });

    next();
  }
}
