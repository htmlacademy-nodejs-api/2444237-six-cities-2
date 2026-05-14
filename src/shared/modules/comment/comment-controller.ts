import { inject } from 'inversify';
import { BaseController } from '../../libs/rest/controller/base-controller.abstract.js';
import { Component } from '../../types/container.js';
import { Logger } from '../../libs/logger/index.js';
import { HttpMethod } from '../../libs/rest/index.js';
import { CommentService } from './comment-service.js';
import { fillDTO } from '../../helpers/common.js';
import { Request, Response } from 'express';
import { CommentRDO } from './rdo/comment-rdo.js';
import { CommentDto } from './dto/comment-dto.js';
import { ValidateDTOMiddleware } from '../../libs/rest/middleware/validate-object.middleware.js';
import { PrivateRouteMiddleware } from '../../libs/rest/middleware/private-route.middleware.js';

export class CommentController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.CommentService)
    private readonly commentService: CommentService,
  ) {
    super(logger);

    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new ValidateDTOMiddleware(CommentDto),
        new PrivateRouteMiddleware(),
      ],
    });
  }

  public async create(req: Request, res: Response) {
    const result = await this.commentService.createComment(req.body);
    this.logger.info(`Comment created: ${req.body.text}`);

    this.created(res, fillDTO(CommentRDO, result));
  }
}
