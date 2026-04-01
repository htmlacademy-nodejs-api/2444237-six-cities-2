import { inject, injectable } from 'inversify';
import { CreateOfferDto } from './dto/offer-dto.js';
import { OfferServiceInterface } from './offer-service.interface.js';
import { OfferEntity } from './offer.entity.js';
import { Component } from '../../types/container.js';
import { Logger } from '../../libs/logger/index.js';
import { City, UpdateOfferDto } from './dto/update-dto.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { CommentEntity } from '../comment/comment.entity.js';
import { Types } from 'mongoose';

@injectable()
export class OfferService implements OfferServiceInterface {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel)
    private readonly offerModel: types.ModelType<OfferEntity>,
    @inject(Component.CommentModel)
    private readonly commentModel: types.ModelType<CommentEntity>,
  ) {}

  async createOffer(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`New offer created: ${dto.title}`);
    return result;
  }

  async findOfferById(id: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findById(id).populate('host').exec();
  }

  async updateById(
    offerId: string,
    dto: UpdateOfferDto,
  ): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, { $set: dto }, { new: true })
      .exec();
  }

  async deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndDelete(offerId).exec();
  }

  async recalcRating(offerId: string): Promise<void> {
    const stats = await this.commentModel.aggregate([
      { $match: { offerId: new Types.ObjectId(offerId) } },
      { $group: { _id: '$offerId', avgRating: { $avg: '$rating' } } },
    ]);

    const avg = stats[0]?.avgRating ?? 0;

    await this.offerModel
      .findByIdAndUpdate(offerId, {
        rating: avg,
      })
      .exec();
  }

  async find(): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.find().populate('host').exec();
  }

  async findPremiumOffersByCity(
    city: City,
  ): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find({ city, isPremium: true })
      .populate('host')
      .exec();
  }

  async incCommentCount(
    offerId: string,
  ): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, { $inc: { commentsCount: 1 } })
      .exec();
  }

  async decCommentCount(
    offerId: string,
  ): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, { $inc: { commentsCount: -1 } })
      .exec();
  }
}
