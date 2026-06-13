import { Expose } from 'class-transformer';
import { Amenity } from '../../../types/offer.js';

export class OfferRDO {
  @Expose()
    _id: string;

  @Expose()
    title: string;

  @Expose()
    description: string;

  @Expose()
    date: Date;

  @Expose()
    city: string;

  @Expose()
    imagePreview: string;

  @Expose()
    images: string[];

  @Expose()
    isPremium: boolean;

  @Expose()
    isFavorite: boolean;

  @Expose()
    rating: number;

  @Expose()
    type: string;

  @Expose()
    bedrooms: number;

  @Expose()
    maxAdults: number;

  @Expose()
    price: number;

  @Expose()
    goods: Amenity[];

  @Expose()
    host: string;

  @Expose()
    commentsCount: number;

  @Expose()
    location: { latitude: number; longitude: number };
}
