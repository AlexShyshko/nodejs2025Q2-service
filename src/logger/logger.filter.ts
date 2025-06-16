import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { LoggerService } from './logger.service';
import { Request, Response } from 'express';
import { STATUS_CODES } from 'http';

@Catch()
class LoggerFilter implements ExceptionFilter {
  constructor(private readonly loggerService: LoggerService) {}

  catch(exception, host: ArgumentsHost) {
    const request: Request = host.switchToHttp().getRequest();
    const response: Response = host.switchToHttp().getResponse();
    let responseStatusCode: number;
    let responseMessage: string;

    try {
      responseStatusCode = exception.getStatus();
      responseMessage = exception?.message || 'Unexpected error';
    } catch {
      responseStatusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      responseMessage = STATUS_CODES[responseStatusCode];
    }

    const { method, protocol, hostname, originalUrl, query, body } = request;
    const requestUrl = `${protocol}://${hostname}:${process.env.PORT}${originalUrl}`;
    const message = `Request method: ${method}. Request URL: ${requestUrl}. Request query parameters: ${JSON.stringify(query)}. Request body: ${JSON.stringify(body)}. Response status code: ${responseStatusCode}. Response status message: ${responseMessage}`;
    this.loggerService.error(message);

    response.status(responseStatusCode).json({
      responseStatusCode,
      message,
    });
  }
}

export { LoggerFilter };
