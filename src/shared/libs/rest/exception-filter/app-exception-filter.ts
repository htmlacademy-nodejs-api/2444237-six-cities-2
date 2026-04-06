import { NextFunction, Request, Response } from "express";
import { ExceptionFilter } from "./exception-filter.interface.js";
import { StatusCodes } from "http-status-codes";
import { Component } from "../../../types/container.js";
import { inject, injectable } from "inversify";
import { Logger } from "../../logger/index.js";
import { HttpError } from "../errors/index.js";
import { createErrorObject } from "../../../helpers/common.js";

@injectable()
export class AppExceptionFilter implements ExceptionFilter {
  constructor(@inject(Component.Logger) private readonly logger: Logger) {
    this.logger.info("AppExceptionFilter was created");
  }

  private handleHttpError(
    error: HttpError,
    _req: Request,
    res: Response,
    _next: NextFunction,
  ) {
    this.logger.error(
      `[${error.detail}]: ${error.httpStatusCode} — ${error.message}`,
      error,
    );

    res.status(error.httpStatusCode).json(createErrorObject(error.message));
  }

  private handleCustomError(
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction,
  ): void {
    this.logger.error(err.message, err);

    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(createErrorObject(err.message));
  }

  catch(err: Error, req: Request, res: Response, next: NextFunction): void {
    this.logger.error(err.message, err);

    if (err instanceof HttpError) {
      return this.handleHttpError(err, req, res, next);
    }

    this.handleCustomError(err, req, res, next);

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
}
