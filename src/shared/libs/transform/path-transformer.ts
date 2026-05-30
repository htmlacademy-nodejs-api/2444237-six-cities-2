import { inject, injectable } from 'inversify';
import { Logger } from '../logger/index.js';
import { Component } from '../../types/container.js';
import { Config, RestSchema } from '../config/index.js';
import {
  DEFAULT_STATIC_IMAGES,
  STATIC_PATH,
  STATIC_RESOURCE_FIELDS,
  UPLOAD_PATH,
} from './transformer.const.js';
import { getFullServerPath } from '../../helpers/common.js';

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

@injectable()
export class PathTransformer {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
  ) {
    this.logger.info('PathTransformer was created');
  }

  private hasDefaultImage(value: string) {
    return DEFAULT_STATIC_IMAGES.includes(value);
  }

  private isStaticProperty(property: string) {
    return STATIC_RESOURCE_FIELDS.includes(property);
  }

  public execute(data: Record<string, unknown>) {
    const stack = [data];
    while (stack.length > 0) {
      const current = stack.pop();
      for (const key in current) {
        if (Object.hasOwn(current, key)) {
          const value = current[key];

          if (isObject(value)) {
            stack.push(value);
            continue;
          }

          if (this.isStaticProperty(key) && typeof value === 'string') {
            const serverHost = this.config.get('HOST');
            const serverPort = this.config.get('PORT');
            const rootPath = this.hasDefaultImage(value)
              ? STATIC_PATH
              : UPLOAD_PATH;
            current[key] =
              `${getFullServerPath(serverHost, serverPort)}${rootPath}/${value}`;
          }
        }
      }
    }

    return data;
  }
}
