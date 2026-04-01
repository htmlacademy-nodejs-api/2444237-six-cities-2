import { DocumentType } from '@typegoose/typegoose';
import { CreateUserDto } from './dto/user-dto.js';
import { UserEntity } from './user.entity.js';
import { OfferEntity } from '../offer/offer.entity.js';

export interface UserServiceInterface {
  register(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
  findById(id: number): Promise<DocumentType<UserEntity> | null>;
  findFavoriteOffers(userId: number): Promise<DocumentType<OfferEntity>[]>;
  toggleFavoriteOffer(offerId: string, userId: number): Promise<void>;
}
