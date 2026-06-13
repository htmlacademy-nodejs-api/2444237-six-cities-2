import {
  defaultClasses,
  getModelForClass,
  modelOptions,
  prop,
  Ref,
} from '@typegoose/typegoose';
import {
  Amenities,
  Amenity,
  CITIES,
  City,
  HousingType,
  HousingTypes,
  Location,
} from '../../types/offer.js';
import { UserEntity } from '../user/user.entity.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'offers',
    timestamps: true,
  },
})

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({
    trim: true,
    required: true,
    minlength: 10,
    maxlength: 100,
  })
  public title!: string;

  @prop({
    trim: true,
    required: true,
    minlength: 20,
    maxlength: 1024,
  })
  public description!: string;

  @prop({ required: true })
  public date!: Date;

  @prop({
    required: true,
    enum: CITIES,
  })
  public city!: City;

  @prop({ required: true })
  public imagePreview!: string;

  @prop({ type: [String], required: true })
  public images!: string[];

  @prop({ required: true })
  public isPremium!: boolean;

  @prop({ required: true })
  public isFavorite!: boolean;

  @prop({ required: true, min: 0, max: 5 })
  public rating!: number;

  @prop({ required: true, enum: HousingTypes })
  public type!: HousingType;

  @prop({ required: true, min: 1, max: 8 })
  public bedrooms!: number;

  @prop({ required: true, min: 1, max: 10 })
  public maxAdults!: number;

  @prop({ required: true, min: 100, max: 100000 })
  public price!: number;

  @prop({
    type: () => [String],
    required: true,
    enum: Amenities,
  })
  public goods!: Amenity[];

  @prop({ required: true, ref: () => UserEntity })
  public host!: Ref<UserEntity>;

  @prop({ required: true })
  public commentsCount!: number;

  @prop({ _id: false, required: true })
  public location!: Location;
}

export const OfferModel = getModelForClass(OfferEntity);
