import { NextFunction, Request, Response } from 'express';
import { Middleware } from '../index.js';
import { HttpError } from '../errors/index.js';
import { StatusCodes } from 'http-status-codes';

export class PrivateRouteMiddleware implements Middleware {
  execute(req: Request, _res: Response, next: NextFunction): void {
    if (!req.tokenPayload) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'PrivateRouteMiddleware',
      );
    }

    return next();
  }
}
