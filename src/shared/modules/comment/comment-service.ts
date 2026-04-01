import { inject, injectable } from 'inversify';
import { CommentServiceInterface } from './comment-service.interface.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/container.js';
import { CommentDto } from './dto/comment-dto.js';
import { CommentEntity } from './comment.entity.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { OfferServiceInterface } from '../offer/offer-service.interface.js';

@injectable()
export class CommentService implements CommentServiceInterface {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.CommentModel)
    private readonly commentModel: types.ModelType<CommentEntity>,
    @inject(Component.OfferService)
    private readonly offerService: OfferServiceInterface,
  ) {}

  public async createComment(dto: CommentDto): Promise<CommentEntity> {
    const result = await this.commentModel.create(dto);
    this.logger.info(`Comment created: ${dto.text}`);

    await this.offerService.incCommentCount(dto.offerId);

    await this.offerService.recalcRating(dto.offerId);

    return result.populate('author');
  }

  public async findByOfferId(
    offerId: string,
  ): Promise<DocumentType<CommentEntity>[]> {
    return this.commentModel.find({ offerId }).populate('author');
  }

  public async deleteByOfferId(offerId: string): Promise<number> {
    const result = await this.commentModel.deleteMany({ offerId }).exec();

    await this.offerService.decCommentCount(offerId);

    await this.offerService.recalcRating(offerId);

    return result.deletedCount;
  }
}
