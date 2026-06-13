import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsMongoId,
  IsObject,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { OfferDTOValidationMessage } from './offer-dto.messages.js';
import {
  Amenities,
  Amenity,
  CITIES,
  City,
  HousingType,
  HousingTypes,
  Location,
} from '../../../types/offer.js';

export class UpdateOfferDto {
  @IsOptional()
  @MinLength(10, { message: OfferDTOValidationMessage.title.minLength })
  @MaxLength(100, { message: OfferDTOValidationMessage.title.maxLength })
    title?: string;

  @IsOptional()
  @MinLength(20, {
    message: OfferDTOValidationMessage.description.minLength,
  })
  @MaxLength(1024, {
    message: OfferDTOValidationMessage.description.maxLength,
  })
    description?: string;

  @IsOptional()
  @IsDateString({}, { message: OfferDTOValidationMessage.date.isDate })
    date?: Date;

  @IsOptional()
  @IsEnum(CITIES, { message: OfferDTOValidationMessage.city.isEnum })
    city?: City;

  @IsOptional()
  @IsString({ message: OfferDTOValidationMessage.imagePreview.isString })
    imagePreview?: string;

  @IsOptional()
  @IsArray({ message: OfferDTOValidationMessage.images.isArray })
    images?: string[];

  @IsOptional()
  @IsBoolean({ message: OfferDTOValidationMessage.isPremium.isBoolean })
    isPremium?: boolean;

  @IsOptional()
  @IsBoolean({ message: OfferDTOValidationMessage.isFavorite.isBoolean })
    isFavorite?: boolean;

  @IsOptional()
  @Min(1, { message: OfferDTOValidationMessage.rating.min })
  @Max(5, { message: OfferDTOValidationMessage.rating.max })
    rating?: number;

  @IsOptional()
  @IsEnum(HousingTypes, {
    message: OfferDTOValidationMessage.type.isEnum,
  })
    type?: HousingType;

  @IsOptional()
  @Min(1, { message: OfferDTOValidationMessage.bedrooms.min })
  @Max(8, { message: OfferDTOValidationMessage.bedrooms.max })
    bedrooms?: number;

  @IsOptional()
  @Min(1, { message: OfferDTOValidationMessage.maxAdults.min })
  @Max(10, { message: OfferDTOValidationMessage.maxAdults.max })
    maxAdults?: number;

  @IsOptional()
  @Min(100, { message: OfferDTOValidationMessage.price.min })
  @Max(100000, { message: OfferDTOValidationMessage.price.max })
    price?: number;

  @IsOptional()
  @IsEnum(Amenities, { message: OfferDTOValidationMessage.goods.isEnum })
    goods?: Amenity[];

  @IsOptional()
  @IsMongoId({ message: OfferDTOValidationMessage.host.isMongoId })
    host?: string;

  @IsOptional()
  @IsInt({ message: OfferDTOValidationMessage.commentsCount.isInt })
    commentsCount?: number;

  @IsOptional()
  @IsObject({ message: OfferDTOValidationMessage.location.isObject })
    location?: Location;
}
