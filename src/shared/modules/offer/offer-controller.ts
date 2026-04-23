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

export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService)
    private readonly offerService: OfferServiceInterface & DocumentExists,
    @inject(Component.CommentService)
    private readonly commentService: CommentServiceInterface,
  ) {
    super(logger);

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDTOMiddleware(CreateOfferDto)],
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Put,
      handler: this.update,
      middlewares: [
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
    console.log(req.body);
    const offers = await this.offerService.find();
    const responseData = fillDTO(OfferRDO, offers);
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

    const result = await this.offerService.createOffer(req.body);
    this.created(res, fillDTO(OfferRDO, result));
  }

  public async update(req: Request, res: Response) {
    const updateOffer = await this.offerService.updateById(
      req.params.id as string,
      req.body,
    );

    this.ok(res, fillDTO(OfferRDO, updateOffer));
  }

  public async delete(req: Request, res: Response) {
    const offer = await this.offerService.findOfferById(
      req.params.id as string,
    );

    if (!offer) {
      const error = new Error(`Offer with id ${req.params.id} not found`);
      this.send(res, StatusCodes.NOT_FOUND, { error: error.message });

      return this.logger.error(error.message, error);
    }
    const result = await this.offerService.deleteById(offer.id);
    this.noContent(res, fillDTO(OfferRDO, result));
  }

  public async showPremiumOffers(req: Request, res: Response) {
    const city = req.params.city as City;
    const premiumOffers = await this.offerService.findPremiumOffersByCity(city);

    this.ok(res, fillDTO(OfferRDO, premiumOffers));
  }

  public async getComments(req: Request, res: Response) {
    const offerId = req.params.offerId;

    const comments = this.commentService.findByOfferId(offerId as string);

    this.ok(res, fillDTO(OfferRDO, comments));
  }
}
