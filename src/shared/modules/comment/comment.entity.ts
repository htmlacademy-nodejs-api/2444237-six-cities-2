import {
  defaultClasses,
  getModelForClass,
  modelOptions,
  prop,
  Ref,
} from '@typegoose/typegoose';
import { UserEntity } from '../user/index.js';
import { OfferEntity } from '../offer/offer.entity.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface CommentEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'comments',
    timestamps: true,
  },
})

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class CommentEntity extends defaultClasses.TimeStamps {
  @prop({ required: true, minlength: 5, maxlength: 1024 })
  public text: string;

  @prop({ required: true, ref: () => OfferEntity })
  public offerId: Ref<OfferEntity>;

  @prop({ required: true, ref: () => UserEntity })
  public author: Ref<UserEntity>;

  @prop({ required: true, min: 1, max: 5, default: 0 })
  public rating: number;

  @prop({ required: true })
  public date: Date;
}

export const CommentModel = getModelForClass(CommentEntity);
