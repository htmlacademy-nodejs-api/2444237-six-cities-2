import { HttpError } from '../../../libs/rest/errors/index.js';

export class BaseUserException extends HttpError {
  constructor(httpStatusCode: number, message: string) {
    super(httpStatusCode, message);
  }
}
