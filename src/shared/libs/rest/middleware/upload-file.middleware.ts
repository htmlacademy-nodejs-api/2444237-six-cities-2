import { NextFunction, Request, Response } from 'express';
import { Middleware } from '../index.js';
import multer, { diskStorage } from 'multer';
import { extension } from 'mime-types';
import * as crypto from 'node:crypto';

export class UploadFileMiddleware implements Middleware {
  constructor(
    private readonly fieldName: string,
    private readonly uploadDirectory: string,
  ) {}

  execute(req: Request, res: Response, next: NextFunction): void {
    const storage = diskStorage({
      destination: this.uploadDirectory,
      filename: (_req, file, callback) => {
        const fileExtention = extension(file.mimetype);
        const filename = crypto.randomUUID();
        callback(null, `${filename}.${fileExtention}`);
      },
    });

    const uploadSingleFileMiddleware = multer({ storage }).single(
      this.fieldName,
    );

    uploadSingleFileMiddleware(req, res, next);
  }
}
