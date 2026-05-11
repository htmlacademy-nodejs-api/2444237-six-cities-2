import { NextFunction, Request, Response } from 'express';
import { Middleware } from '../index.js';
import crypto from 'node:crypto';
import { jwtVerify } from 'jose';
import { HttpError } from '../errors/index.js';
import { StatusCodes } from 'http-status-codes';
import { TokenPayload } from '../../../modules/auth/types/TokenPayload.js';

function isTokenPayload(payload: unknown): payload is TokenPayload {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    'email' in payload &&
    typeof payload.email === 'string' &&
    'name' in payload &&
    typeof payload.name === 'string' &&
    'id' in payload &&
    typeof payload.id === 'string'
  );
}

export class ParseTokenMiddleware implements Middleware {
  constructor(private readonly jwtSecret: string) {}

  async execute(
    req: Request,
    _res: Response,
    next: NextFunction,
  ): Promise<void> {
    const authorizationHeader = req.headers?.authorization?.split(' ');

    if (
      !authorizationHeader ||
      authorizationHeader?.[0] !== 'Bearer' ||
      !authorizationHeader?.[1]
    ) {
      return next();
    }

    const [, token] = authorizationHeader;
    try {
      const { payload } = await jwtVerify(
        token,
        crypto.createSecretKey(this.jwtSecret, 'utf-8'),
      );

      if (isTokenPayload(payload)) {
        req.tokenPayload = { ...payload };
      }
      return next();
    } catch (err) {
      return next(
        new HttpError(
          StatusCodes.UNAUTHORIZED,
          'Invalid token',
          'AuthenticateMiddleware',
        ),
      );
    }
  }
}
