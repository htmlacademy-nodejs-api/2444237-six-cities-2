import { inject } from 'inversify';
import { BaseController } from '../../libs/rest/controller/base-controller.abstract.js';
import { Component } from '../../types/container.js';
import { HttpMethod } from '../../libs/rest/index.js';
import { Request, Response } from 'express';
import { Logger } from '../../libs/logger/index.js';
import { UserServiceInterface } from './user-service.interface.js';
import { StatusCodes } from 'http-status-codes';
import { Config, RestSchema } from '../../libs/config/index.js';
import {
  LoggedUserRDO,
  UserFavoriteOfferRDO,
  UserRDO,
} from './rdo/user.rdo.js';
import { fillDTO } from '../../helpers/common.js';
import { HttpError } from '../../libs/rest/errors/http-error.js';
import { ValidateDTOMiddleware } from '../../libs/rest/middleware/validate-object.middleware.js';
import { CreateUserDto, LoginUserDTO } from './dto/user-dto.js';
import { AuthServiceInterface, UserNotFoundException } from '../auth/index.js';
import { PrivateRouteMiddleware } from '../../libs/rest/middleware/private-route.middleware.js';
import { UploadFileMiddleware } from '../../libs/rest/middleware/upload-file.middleware.js';
import { OfferServiceInterface } from '../offer/offer-service.interface.js';

export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService)
    private readonly offerService: OfferServiceInterface,
    @inject(Component.UserService)
    private readonly userService: UserServiceInterface,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.AuthService)
    private readonly authService: AuthServiceInterface,
  ) {
    super(logger);
    this.addRoute({
      path: '/register',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDTOMiddleware(CreateUserDto)],
    });

    this.addRoute({
      path: '/login',
      method: HttpMethod.Post,
      handler: this.auth,
      middlewares: [new ValidateDTOMiddleware(LoginUserDTO)],
    });

    this.addRoute({
      path: '/:userId/favorite',
      method: HttpMethod.Get,
      handler: this.getFavorites,
      middlewares: [new PrivateRouteMiddleware()],
    });

    this.addRoute({
      path: '/:userId/avatar',
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new UploadFileMiddleware(
          this.config.get('UPLOAD_FILE_DIRECTORY'),
          'avatar',
        ),
      ],
    });

    this.addRoute({
      path: '/login',
      method: HttpMethod.Get,
      handler: this.checkAuthenticate,
      middlewares: [new PrivateRouteMiddleware()],
    });

    this.addRoute({
      path: '/:offerId/favorite',
      method: HttpMethod.Post,
      handler: this.addFavoriteOffers,
      middlewares: [new PrivateRouteMiddleware()],
    });

    this.addRoute({
      path: '/:offerId/favorite',
      method: HttpMethod.Delete,
      handler: this.deleteFavoriteOffers,
      middlewares: [new PrivateRouteMiddleware()],
    });
  }

  public async create(req: Request, res: Response) {
    const existsUser = await this.userService.findByEmail(req.body.email);

    if (existsUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email ${req.body.email} already exists`,
      );
    }

    const result = await this.userService.register(
      req.body,
      this.config.get('SALT'),
    );
    this.created(res, fillDTO(UserRDO, result));
  }

  public async getFavorites(req: Request, res: Response) {
    const user = await this.userService.findById(req.tokenPayload.id);
    if (!user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserController',
      );
    }
    const favorites = await this.userService.findFavoriteOffers(user.id);

    this.ok(res, fillDTO(UserFavoriteOfferRDO, favorites));
  }

  public async auth(req: Request, res: Response) {
    const user = await this.authService.verify(req.body as LoginUserDTO);

    if (!user) {
      throw new UserNotFoundException();
    }

    const token = await this.authService.authenticate(user);

    const response = fillDTO(LoggedUserRDO, { email: user.email, token });

    this.ok(res, response);
  }

  public uploadAvatar(req: Request, res: Response) {
    this.created(res, {
      file: req.file?.path,
    });
  }

  public async checkAuthenticate(req: Request, res: Response) {
    const user = await this.userService.findByEmail(req.tokenPayload.email);

    if (!user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserController',
      );
    }
    this.ok(res, fillDTO(LoggedUserRDO, user));
  }

  public async addFavoriteOffers(req: Request, res: Response) {
    const { offerId } = req.params;
    const user = await this.userService.findById(req.tokenPayload.id);
    if (!user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserController',
      );
    }
    const offer = await this.offerService.findOfferById(offerId as string);
    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        'Offer not found',
        'UserController',
      );
    }
    const response = await this.userService.addFavoriteOffer(offer.id, user.id);
    this.ok(res, response);
  }

  async deleteFavoriteOffers(req: Request, res: Response) {
    const { offerId } = req.params;
    const user = await this.userService.findById(req.tokenPayload.id);
    if (!user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserController',
      );
    }
    const offer = await this.offerService.findOfferById(offerId as string);
    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        'Offer not found',
        'UserController',
      );
    }
    await this.userService.deleteFavoriteOffer(offer.id, user.id);
    const updatedUser = await this.userService.findById(user.id);
    this.ok(res, updatedUser);
  }
}
