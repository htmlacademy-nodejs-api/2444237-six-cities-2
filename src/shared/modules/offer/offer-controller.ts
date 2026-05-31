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
        new IsOfferOwnerMiddleware(this.offerService),
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDTOMiddleware(UpdateOfferDto),
        new DocumentExistsMiddleware('offerId', 'offer', this.offerService),
      ],
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware(),
        new IsOfferOwnerMiddleware(this.offerService),
        new ValidateObjectIdMiddleware('offerId'),
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
    const existOffer = await this.offerService.findOfferById(req.body.id);

    if (existOffer) {
      const error = new Error(`Offer with id ${req.body.id} already exists`);
      this.send(res, StatusCodes.UNPROCESSABLE_ENTITY, {
        error: error.message,
      });

      return this.logger.error(error.message, error);
    }

    const result = await this.offerService.createOffer({
      ...req.body,
      host: req.tokenPayload.id,
    });
    this.created(res, fillDTO(OfferRDO, result));
  }

  public async getDetailOffers(req: Request, res: Response) {
    const offer = await this.offerService.findOfferById(
      req.params.offerId as string,
    );
    this.ok(res, fillDTO(OfferRDO, offer));
  }

  public async update(req: Request, res: Response) {
    const { offerId } = req.params;
    const updateOffer = await this.offerService.updateById(
      offerId as string,
      req.body,
    );

    this.ok(res, fillDTO(OfferRDO, updateOffer));
  }

  public async delete(req: Request, res: Response) {
    const { offerId } = req.params;
    const offer = await this.offerService.findOfferById(offerId as string);

    if (!offer) {
      const error = new Error(`Offer with id ${offerId} not found`);
      this.send(res, StatusCodes.NOT_FOUND, { error: error.message });

      return this.logger.error(error.message, error);
    }
    const result = await this.offerService.deleteById(offer.id);
    await this.commentService.deleteByOfferId(offer.id);

    this.noContent(res, fillDTO(OfferRDO, result));
  }

  public async showPremiumOffers(req: Request, res: Response) {
    const { city } = req.params;
    const premiumOffers = await this.offerService.findPremiumOffersByCity(
      city as City,
    );

    this.ok(res, fillDTO(OfferRDO, premiumOffers));
  }

  public async getComments(req: Request, res: Response) {
    const { offerId } = req.params;

    const comments = await this.commentService.findByOfferId(offerId as string);

    this.ok(res, fillDTO(CommentRDO, comments));
  }
}
