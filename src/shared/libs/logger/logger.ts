import { resolve } from 'node:path';
import { getCurrentModulePath } from '../../helpers/file-system.js';
import { Logger } from './logger.interface.js';
import { Logger as PinoInstance, pino, transport } from 'pino';
import { injectable } from 'inversify';

const LOG_FILE_PATH = 'logs/rest.log';

@injectable()
export class PinoLogger implements Logger {
  private readonly logger: PinoInstance;

  constructor() {
    const modulePath = getCurrentModulePath();
    const destination = resolve(modulePath, '../../../', LOG_FILE_PATH);

    const multiTransport = transport({
      targets: [
        {
          target: 'pino/file',
          options: {
            destination,
          },
        },
        {
          target: 'pino-pretty',
        },
      ],
    });

    this.logger = pino({}, multiTransport);
  }

  info(message: string, ...args: unknown[]): void {
    this.logger.info({ meta: args }, message);
  }

  debug(message: string, ...args: unknown[]): void {
    this.logger.debug({ meta: args }, message);
  }

  warn(message: string, ...args: unknown[]): void {
    this.logger.warn({ meta: args }, message);
  }

  error(message: string, ...args: unknown[]): void {
    this.logger.error({ meta: args }, message);
  }
}
