import { createSha256 } from '../../helpers/hash.js';
import { User } from '../../types/user.interface.js';
import type { OfferEntity } from '../offer/offer.entity.js';

import {
  defaultClasses,
  getModelForClass,
  modelOptions,
  prop,
  Ref,
} from '@typegoose/typegoose';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users',
    timestamps: true,
  },
})

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class UserEntity extends defaultClasses.TimeStamps implements User {
  @prop({ required: true, minlength: 1, maxlength: 15, default: '' })
  public name!: string;

  @prop({ required: true, default: '', unique: true })
  public email: string;

  @prop({ required: false, default: '' })
  public avatar: string;

  @prop({ required: true, minlength: 6, maxlength: 1024, default: '' })
  public password: string;

  @prop({ required: true })
  public isPro: boolean;

  @prop({ ref: 'OfferEntity', default: [] })
  public favorites: Ref<OfferEntity>[];

  constructor(userData: User) {
    super();
    this.name = userData.name;
    this.email = userData.email;
    this.avatar = userData.avatar;
    this.password = userData.password;
    this.isPro = userData.isPro;
  }

  public setPassword(password: string, salt: string): void {
    this.password = createSha256(password, salt);
  }

  public getPassword(): string {
    return this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
