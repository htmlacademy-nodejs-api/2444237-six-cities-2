import { DocumentType } from '@typegoose/typegoose';
import { CreateUserDto } from './dto/user-dto.js';
import { UserServiceInterface } from './user-service.interface.js';
import { UserEntity, UserModel } from './user.entity.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/container.js';
import { Logger } from '../../libs/logger/index.js';
import { OfferEntity } from '../offer/offer.entity.js';

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

  async findById(id: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findById(id).exec();
  }

  async findFavoriteOffers(
    userId: number,
  ): Promise<DocumentType<OfferEntity>[]> {
    const user = await UserModel.findById(userId).populate('favorites').exec();

    return (user?.favorites as DocumentType<OfferEntity>[]) ?? [];
  }

  async toggleFavoriteOffer(offerId: string, userId: number): Promise<void> {
    const user = await UserModel.findById(userId).populate('favorites').exec();
    if (!user) {
      return;
    }

    if (user.favorites.find((offer) => offer._id.toString() === offerId)) {
      await UserModel.findByIdAndUpdate(userId, {
        $pull: { favorites: offerId },
      });
    } else {
      await UserModel.findByIdAndUpdate(userId, {
        $push: { favorites: offerId },
      });
    }
  }
}
