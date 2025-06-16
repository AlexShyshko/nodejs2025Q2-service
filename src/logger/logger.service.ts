import {
  Injectable,
  LoggerService as NestLoggerService,
  LogLevel,
} from '@nestjs/common';
import { join } from 'node:path';
import { access, mkdir, stat, rename, writeFile } from 'node:fs/promises';
import { mc } from '../message-colorizer/message-colorizer';

const logLevelMapper = {
  fatal: { level: 1, color: 'red' },
  error: { level: 2, color: 'magenta' },
  warn: { level: 3, color: 'yellow' },
  log: { level: 4, color: 'green' },
  debug: { level: 5, color: 'cyan' },
  verbose: { level: 6, color: 'blue' },
} as const;

@Injectable()
class LoggerService implements NestLoggerService {
  readonly #logLevelMapper: typeof logLevelMapper;
  readonly #logDirectory: string;

  constructor() {
    this.#logLevelMapper = logLevelMapper;
    this.#logDirectory = join(__dirname, '..', '..', 'LOG_FILES');
    this.#makeLogDirectory();
  }

  fatal(message: any, ...optionalParams: any[]) {
    this.#customLog('fatal', message, optionalParams);
  }

  error(message: any, ...optionalParams: any[]) {
    this.#customLog('error', message, optionalParams);
  }

  warn(message: any, ...optionalParams: any[]) {
    this.#customLog('warn', message, optionalParams);
  }

  log(message: any, ...optionalParams: any[]) {
    this.#customLog('log', message, optionalParams);
  }

  debug(message: any, ...optionalParams: any[]) {
    this.#customLog('debug', message, optionalParams);
  }

  verbose(message: any, ...optionalParams: any[]) {
    this.#customLog('verbose', message, optionalParams);
  }

  async #customLog(
    messageType: LogLevel,
    message: unknown,
    optionalParams: unknown[],
  ) {
    const { level, color } = this.#logLevelMapper[messageType];

    if (level > Number(process.env.LOG_MAX_LEVEL)) {
      return;
    }

    const timestamp = this.#getLogTimestamp();
    const parameters = this.#getLogParameters(optionalParams);
    let logMessage: string;
    let targetFileName: string;

    if (messageType === 'fatal' || messageType === 'error') {
      targetFileName = 'error';
      logMessage = `${timestamp} - Error. ${message}. Parameters: ${parameters}`;
    } else {
      targetFileName = 'info';
      logMessage = `${timestamp} - ${message}. Parameters: ${parameters}`;
    }

    console.log(`${mc.colorize(logMessage, color)}`);

    const targetFile = `${targetFileName}.log`;
    const targetFilePath = join(this.#logDirectory, targetFile);

    try {
      const logFileStat = await stat(targetFilePath);
      const maxFileSizeInKb = Number(process.env.LOG_FILE_MAX_SIZE) * 1024;
      const isFileToArchive = logFileStat.size >= maxFileSizeInKb;

      if (isFileToArchive || !logFileStat.isFile) {
        const archiveFilePath = join(
          this.#logDirectory,
          `${timestamp}_${targetFile}`,
        );
        await rename(targetFilePath, archiveFilePath);
      }
    } catch {
    } finally {
      await writeFile(targetFilePath, `${logMessage}\n`, { flag: 'a' });
    }
  }

  #getLogParameters(params: unknown[] | undefined): string {
    let result: string;

    if (params) {
      result = params
        .map((data) => {
          if (data instanceof Error) {
            return JSON.stringify({ message: data.message });
          }

          return JSON.stringify(data);
        })
        .join('; ');
    } else {
      result = '';
    }

    return result;
  }

  #getLogTimestamp() {
    const safeTimestamp = new Date()
      .toISOString()
      .replace(/:/g, '-')
      .replace(/\./g, '-')
      .replace(/T/, '_')
      .replace(/Z/, '');

    return safeTimestamp;
  }

  async #makeLogDirectory() {
    try {
      await access(this.#logDirectory);
    } catch (err) {
      if (err.code === 'ENOENT') {
        await mkdir(this.#logDirectory, { recursive: true });
      } else {
        throw err;
      }
    }
  }
}

export { LoggerService };
