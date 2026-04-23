import { NextFunction, Request, Response } from 'express';
import { Middleware } from '../index.js';
import { DocumentExists } from '../types/document-exists.interface.js';
import { StatusCodes } from 'http-status-codes';
import { HttpError } from '../errors/index.js';

export class DocumentExistsMiddleware implements Middleware {
  constructor(
    private readonly paramName: string,
    private readonly entityName: string,
    private readonly service: DocumentExists,
  ) {}

  async execute(
    { params }: Request,
    _res: Response,
    next: NextFunction,
  ): Promise<void> {
    const documentId = params[this.paramName];

    if (!(await this.service.exists(documentId as string))) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `${this.entityName} with id ${documentId} not found`,
      );
    }

    next();
  }
}
