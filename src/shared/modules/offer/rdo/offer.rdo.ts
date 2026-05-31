import { Expose } from 'class-transformer';

export class OfferRDO {
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
    price: number;

  @Expose()
    commentsCount: number;
}
