import {
  Amenities,
  Amenity,
  CITIES,
  City,
  HousingType,
  HousingTypes,
} from '../../../types/offer.js';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsObject,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { OfferDTOValidationMessage } from './offer-dto.messages.js';

export class CreateOfferDto {
  @MinLength(10, { message: OfferDTOValidationMessage.title.minLength })
  @MaxLength(100, { message: OfferDTOValidationMessage.title.maxLength })
    title!: string;

  @MinLength(20, {
    message: OfferDTOValidationMessage.description.minLength,
  })
  @MaxLength(1024, {
    message: OfferDTOValidationMessage.description.maxLength,
  })
    description!: string;

  @IsDateString({}, { message: OfferDTOValidationMessage.date.isDate })
    date!: Date;

  @IsEnum(CITIES, { message: OfferDTOValidationMessage.city.isEnum })
    city!: City;

  @IsString({ message: OfferDTOValidationMessage.imagePreview.isString })
    imagePreview!: string;

  @IsArray({ message: OfferDTOValidationMessage.images.isArray })
    images!: string[];

  @IsBoolean({ message: OfferDTOValidationMessage.isPremium.isBoolean })
    isPremium!: boolean;

  @IsBoolean({ message: OfferDTOValidationMessage.isFavorite.isBoolean })
    isFavorite!: boolean;

  @Min(0, { message: OfferDTOValidationMessage.rating.min })
  @Max(5, { message: OfferDTOValidationMessage.rating.max })
    rating!: number;

  @IsEnum(HousingTypes, {
    message: OfferDTOValidationMessage.type.isEnum,
  })
    type!: HousingType;

  @Min(1, { message: OfferDTOValidationMessage.bedrooms.min })
  @Max(8, { message: OfferDTOValidationMessage.bedrooms.max })
    bedrooms!: number;

  @Min(1, { message: OfferDTOValidationMessage.maxAdults.min })
  @Max(10, { message: OfferDTOValidationMessage.maxAdults.max })
    maxAdults!: number;

  @Min(100, { message: OfferDTOValidationMessage.price.min })
  @Max(100000, { message: OfferDTOValidationMessage.price.max })
    price!: number;

  @IsArray({ message: OfferDTOValidationMessage.goods.isArray })
  @IsEnum(Amenities, {
    each: true,
    message: OfferDTOValidationMessage.goods.isEnum,
  })
    goods!: Amenity[];

  @IsString({ message: OfferDTOValidationMessage.host.isMongoId })
    host!: string;

  @IsInt({ message: OfferDTOValidationMessage.commentsCount.isInt })
    commentsCount!: number;

  @IsObject({ message: OfferDTOValidationMessage.location.isObject })
    location!: { latitude: number; longitude: number };
}
