import { Middleware } from './middleware.interface.js';
import { OfferServiceInterface } from '../../../modules/offer/offer-service.interface.js';
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { HttpError } from '../errors/index.js';

export class IsOfferOwnerMiddleware implements Middleware {
  constructor(private readonly service: OfferServiceInterface) {}

  async execute(
    req: Request,
    _res: Response,
    next: NextFunction,
  ): Promise<void> {
    const userId = req.tokenPayload.id;
    const { offerId } = req.params;

    const offer = await this.service.findOfferById(offerId as string);

    if (!offer) {
      return next(
        new HttpError(
          StatusCodes.NOT_FOUND,
          'Offer not found',
          'IsOfferOwnerMiddleware',
        ),
      );
    }

    if (!userId) {
      return next(
        new HttpError(
          StatusCodes.UNAUTHORIZED,
          'Unauthorized',
          'IsOfferOwnerMiddleware',
        ),
      );
    }

    if (offer.host.toString() !== userId) {
      return next(
        new HttpError(
          StatusCodes.FORBIDDEN,
          'You are not the owner of this offer',
          'IsOfferOwnerMiddleware',
        ),
      );
    }

    return next();
  }
}
