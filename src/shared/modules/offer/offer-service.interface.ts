import { DocumentType } from '@typegoose/typegoose';
import { CreateOfferDto } from './dto/offer-dto.js';
import { OfferEntity } from './offer.entity.js';
import { City, UpdateOfferDto } from './dto/update-dto.js';

export interface OfferServiceInterface {
  createOffer(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  findOfferById(id: string): Promise<DocumentType<OfferEntity> | null>;
  updateById(
    offerId: string,
    dto: UpdateOfferDto,
  ): Promise<DocumentType<OfferEntity> | null>;
  recalcRating(offerId: string): Promise<void>;
  deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  decCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  findPremiumOffersByCity(city: City): Promise<DocumentType<OfferEntity>[]>;
  find(): Promise<DocumentType<OfferEntity>[]>;
}
