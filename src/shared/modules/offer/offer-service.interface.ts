import { DocumentType } from '@typegoose/typegoose';
import { CreateOfferDto } from './dto/offer-dto.js';
import { OfferEntity } from './offer.entity.js';
import { City, UpdateOfferDto } from './dto/update-dto.js';
import { UserEntity } from '../user/index.js';

export interface OfferServiceInterface {
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  findById(id: string): Promise<DocumentType<OfferEntity> | null>;
  updateById(
    offerId: string,
    dto: UpdateOfferDto,
  ): Promise<DocumentType<OfferEntity> | null>;
  recalcRating(offerId: string): Promise<void>;
  deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  decCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  findPremiumOffersByCity(city: City): Promise<DocumentType<OfferEntity>[]>;
  deleteFavorite(
    offerId: string,
    userId: string,
  ): Promise<DocumentType<UserEntity> | null>;
  addFavorite(
    offerId: string,
    userId: string,
  ): Promise<DocumentType<UserEntity> | null>;
  find(limit: number): Promise<DocumentType<OfferEntity>[]>;
}
