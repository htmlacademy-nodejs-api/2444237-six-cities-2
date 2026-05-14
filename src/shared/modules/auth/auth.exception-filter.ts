import { NextFunction, Request, Response } from 'express';
import { ExceptionFilter } from '../../libs/rest/exception-filter/exception-filter.interface.js';
import { BaseUserException } from './index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/container.js';
import { inject, injectable } from 'inversify';

@injectable()
export class AuthExceptionFilter implements ExceptionFilter {
  constructor(@inject(Component.Logger) private readonly logger: Logger) {
    this.logger.info('AuthExceptionFilter was created');
  }

  public catch(
    error: unknown,
    _req: Request,
    res: Response,
    next: NextFunction,
  ): void {
    if (!(error instanceof BaseUserException)) {
      return next(error);
    }

    this.logger.error(`[AuthModule] ${error.message}`, error);

    res.status(error.httpStatusCode).json({
      type: 'AUTHORIZATION',
      error: error.message,
    });
  }
}
