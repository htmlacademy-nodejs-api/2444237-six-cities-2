import { DocumentType } from '@typegoose/typegoose';
import { CreateUserDto } from './dto/user-dto.js';
import { UserServiceInterface } from './user-service.interface.js';
import { UserEntity, UserModel } from './user.entity.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/container.js';
import { Logger } from '../../libs/logger/index.js';
import { OfferEntity, OfferModel } from '../offer/offer.entity.js';

@injectable()
export class UserService implements UserServiceInterface {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.UserModel) private readonly userModel: typeof UserModel,
  ) {}

  async register(
    dto: CreateUserDto,
    salt: string,
  ): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity(dto);
    user.setPassword(dto.password, salt);

    const result = await UserModel.create(user);
    this.logger.info(`User created: ${user.email}`);

    return result;
  }

  async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: number): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findById(id).exec();
  }

  async findFavoriteOffers(
    userId: number,
  ): Promise<DocumentType<OfferEntity>[]> {
    const user = await UserModel.findById(userId).populate('favorites').exec();

    return (user?.favorites as DocumentType<OfferEntity>[]) ?? [];
  }

  async updateAndDeleteFavoriteOffer(
    offerId: string,
    userId: number,
  ): Promise<DocumentType<OfferEntity> | null> {
    const user = await UserModel.findById(userId).populate('favorites').exec();
    const offer = await OfferModel.findById(offerId).exec();
    if (!user) {
      return null;
    }
    const index = user.favorites.findIndex((id) => id.toString() === offerId);

    if (index === -1) {
      await UserModel.findByIdAndUpdate(userId, {
        $push: { favorites: offerId },
      });
    } else {
      await UserModel.findByIdAndUpdate(userId, {
        $pull: { favorites: offerId },
      });
    }

    return offer;
  }
}
