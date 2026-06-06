import { inject } from 'inversify';
import { BaseController } from '../../libs/rest/controller/base-controller.abstract.js';
import { Component } from '../../types/container.js';
import { OfferServiceInterface } from './offer-service.interface.js';
import { HttpMethod } from '../../libs/rest/index.js';
import { Request, Response } from 'express';
import { Logger } from '../../libs/logger/index.js';
import { fillDTO } from '../../helpers/common.js';
import { OfferRDO } from './rdo/offer.rdo.js';
import { StatusCodes } from 'http-status-codes';
import { ValidateObjectIdMiddleware } from '../../libs/rest/middleware/validate-objectid.middleware.js';
import { City } from '../../types/offer.js';
import { CommentServiceInterface } from '../comment/comment-service.interface.js';
import { ValidateDTOMiddleware } from '../../libs/rest/middleware/validate-object.middleware.js';
import { CreateOfferDto } from './dto/offer-dto.js';
import { UpdateOfferDto } from './dto/update-dto.js';
import { DocumentExistsMiddleware } from '../../libs/rest/middleware/document-exists.middleware.js';
import { DocumentExists } from '../../libs/rest/types/document-exists.interface.js';
import { PrivateRouteMiddleware } from '../../libs/rest/middleware/private-route.middleware.js';
import { UserServiceInterface } from '../user/user-service.interface.js';
import { CommentRDO } from '../comment/rdo/comment-rdo.js';
import { MAX_DISPLAY_OFFERS_COUNT } from './offer.const.js';
import { IsOfferOwnerMiddleware } from '../../libs/rest/middleware/offer-owner.middleware.js';
import { HttpError } from '../../libs/rest/errors/index.js';

export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService)
    private readonly offerService: OfferServiceInterface & DocumentExists,
    @inject(Component.CommentService)
    private readonly commentService: CommentServiceInterface,
    @inject(Component.UserService)
    private readonly userService: UserServiceInterface,
  ) {
    super(logger);

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDTOMiddleware(CreateOfferDto),
      ],
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Put,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDTOMiddleware(UpdateOfferDto),
        new IsOfferOwnerMiddleware(this.offerService),
        new DocumentExistsMiddleware('offerId', 'offer', this.offerService),
      ],
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new IsOfferOwnerMiddleware(this.offerService),
        new DocumentExistsMiddleware('offerId', 'offer', this.offerService),
      ],
    });
    this.addRoute({
      path: '/premium/:city',
      method: HttpMethod.Get,
      handler: this.showPremiumOffers,
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.getDetailOffers,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware('offerId', 'offer', this.offerService),
      ],
    });
    this.addRoute({
      path: '/:offerId/comments',
      method: HttpMethod.Get,
      handler: this.getComments,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware('offerId', 'offer', this.offerService),
      ],
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

  public async index(req: Request, res: Response) {
    const limit = Number(req.params.limit) || MAX_DISPLAY_OFFERS_COUNT;
    const offers = await this.offerService.find(limit);
    let favoritesIds: string[] = [];

    if (req.tokenPayload) {
      const user = await this.userService.findById(req.tokenPayload.id);
      favoritesIds =
        user?.favorites.map((offer) => offer.toString()) ?? ([] as string[]);
    }

    const offersWithStatus = offers.map((offer) => ({
      ...offer.toObject(),
      isFavorite: favoritesIds.includes(offer.id),
    }));

    const responseData = fillDTO(OfferRDO, offersWithStatus);

    this.ok(res, responseData);
  }

  public async create(req: Request, res: Response): Promise<void> {
    const existOffer = await this.offerService.findById(req.body.id);

    if (existOffer) {
      const error = new Error(`Offer with id ${req.body.id} already exists`);
      this.send(res, StatusCodes.UNPROCESSABLE_ENTITY, {
        error: error.message,
      });

      return this.logger.error(error.message, error);
    }

    const result = await this.offerService.create({
      ...req.body,
      host: req.tokenPayload.id,
    });
    this.created(res, fillDTO(OfferRDO, result));
  }

  public async getDetailOffers(req: Request, res: Response) {
    const offer = await this.offerService.findById(
      req.params.offerId as string,
    );

    let isFavorite = false;

    if (req.tokenPayload) {
      const user = await this.userService.findById(req.tokenPayload.id);
      isFavorite =
        user?.favorites.some((id) => id.toString() === offer?.id) ?? false;
    }
    this.ok(res, fillDTO(OfferRDO, { ...offer?.toObject(), isFavorite }));
  }

  public async update(req: Request, res: Response) {
    const { offerId } = req.params;
    const updateOffer = await this.offerService.updateById(
      offerId as string,
      req.body,
    );

    this.ok(res, fillDTO(OfferRDO, updateOffer));
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
    const offer = await this.offerService.findById(offerId as string);
    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        'Offer not found',
        'UserController',
      );
    }
    const response = await this.offerService.addFavorite(offer.id, user.id);
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
    const offer = await this.offerService.findById(offerId as string);
    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        'Offer not found',
        'UserController',
      );
    }
    await this.offerService.deleteFavorite(offer.id, user.id);
    const updatedUser = await this.userService.findById(user.id);
    this.ok(res, updatedUser);
  }

  public async delete(req: Request, res: Response) {
    const { offerId } = req.params;
    const offer = await this.offerService.findById(offerId as string);

    if (!offer) {
      const error = new Error(`Offer with id ${offerId} not found`);
      this.send(res, StatusCodes.NOT_FOUND, { error: error.message });

      return this.logger.error(error.message, error);
    }
    const result = await this.offerService.deleteById(offer.id);
    await this.commentService.deleteById(offer.id);

    this.noContent(res, fillDTO(OfferRDO, result));
  }

  public async showPremiumOffers(req: Request, res: Response) {
    const { city } = req.params;
    const premiumOffers = await this.offerService.findPremiumOffersByCity(
      city as City,
    );

    let favoritesIds: string[] = [];

    if (req.tokenPayload) {
      const user = await this.userService.findById(req.tokenPayload.id);
      favoritesIds =
        user?.favorites.map((offer) => offer.toString()) ?? ([] as string[]);
    }

    const offersWithStatus = premiumOffers.map((offer) => ({
      ...offer.toObject(),
      isFavorite: favoritesIds.includes(offer.id),
    }));

    this.ok(res, fillDTO(OfferRDO, offersWithStatus));
  }

  public async getComments(req: Request, res: Response) {
    const { offerId } = req.params;

    const comments = await this.commentService.findById(offerId as string);

    this.ok(res, fillDTO(CommentRDO, comments));
  }
}
