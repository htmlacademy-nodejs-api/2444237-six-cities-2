import { inject, injectable } from 'inversify';
import { Controller } from './controller.interface.js';
import { Response, Router } from 'express';
import { Route } from '../types/route.interface.js';
import { StatusCodes } from 'http-status-codes';
import { Logger } from '../../logger/index.js';
import expressAsyncHandler from 'express-async-handler';
import { Component } from '../../../types/container.js';
import { PathTransformer } from '../../transform/path-transformer.js';

const DEFAULT_CONTENT_TYPE = 'application/json';

@injectable()
export abstract class BaseController implements Controller {
  private readonly _router: Router;

  constructor(protected readonly logger: Logger) {
    this._router = Router();
  }

  @inject(Component.PathTransformer)
  protected readonly pathTransformer: PathTransformer;

  get router(): Router {
    return this._router;
  }

  public addRoute(route: Route) {
    const wrappedHandler = expressAsyncHandler(route.handler.bind(this));
    const middlewareHandlers = route.middlewares?.map((item) =>
      expressAsyncHandler(item.execute.bind(item)),
    );

    const allHandlers = middlewareHandlers
      ? [...middlewareHandlers, wrappedHandler]
      : [wrappedHandler];
    this._router[route.method](route.path, allHandlers);

    this.logger.info(
      `Route registered: ${route.method.toUpperCase()} ${route.path}`,
    );
  }

  public send<T>(res: Response, statusCode: number, data?: T) {
    const modifiedData = this.pathTransformer.execute(
      data as Record<string, unknown>,
    );
    res.type(DEFAULT_CONTENT_TYPE).status(statusCode).json(modifiedData);
  }

  public created<T>(res: Response, data: T) {
    this.send(res, StatusCodes.CREATED, data);
  }

  public ok<T>(res: Response, data?: T) {
    this.send(res, StatusCodes.OK, data);
  }

  public noContent(res: Response): void {
    this.send(res, StatusCodes.NO_CONTENT);
  }
}
