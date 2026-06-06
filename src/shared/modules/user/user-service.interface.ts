import { DocumentType } from '@typegoose/typegoose';
import { CreateUserDto } from './dto/user-dto.js';
import { UserEntity } from './user.entity.js';
import { OfferEntity } from '../offer/offer.entity.js';

export interface UserServiceInterface {
  register(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
  findById(id: string): Promise<DocumentType<UserEntity> | null>;
  findFavorite(userId: number): Promise<DocumentType<OfferEntity>[]>;
  updateAvatar(
    userId: number,
    avatar: string,
  ): Promise<DocumentType<UserEntity> | null>;
}
