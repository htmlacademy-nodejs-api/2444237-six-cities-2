import {
  generateRandomValue,
  getRandomItem,
  getRandomItems,
} from '../../helpers/common.js';
import { MockServerData } from '../../types/mock-server.js';
import { OfferGenerator } from './offer-generator.interface.js';

const MAX_PRICE = 100000;
const MIN_PRICE = 100;

const MAX_BEDROOMS = 8;
const MIN_BEDROOMS = 1;

const MAX_ADULTS = 10;
const MIN_ADULTS = 1;

export class TSVOfferGenerator implements OfferGenerator {
  constructor(private readonly mockData: MockServerData) {}

  generate(): string {
    const id = getRandomItem<number>(this.mockData.id);
    const title = getRandomItem<string>(this.mockData.title);
    const description = getRandomItem<string>(this.mockData.description);
    const postDate = getRandomItem<string>(this.mockData.postDate);
    const city = getRandomItem<string>(this.mockData.city);
    const previewImage = getRandomItem<string>(this.mockData.previewImage);
    const images = getRandomItems<string>(this.mockData.images);
    const isPremium = getRandomItem<boolean>(this.mockData.isPremium);
    const isFavorite = getRandomItem<boolean>(this.mockData.isFavorite);
    const rating = getRandomItem<number>(this.mockData.rating);
    const type = getRandomItem<string>(this.mockData.type);
    const bedrooms = generateRandomValue(MIN_BEDROOMS, MAX_BEDROOMS);
    const maxAdults = generateRandomValue(MIN_ADULTS, MAX_ADULTS);
    const price = generateRandomValue(MIN_PRICE, MAX_PRICE);
    const goods = getRandomItems<string>(this.mockData.goods);
    const hostId = getRandomItem<number>(this.mockData.hostId);
    const hostName = getRandomItem<string>(this.mockData.hostName);
    const hostEmail = getRandomItem<string>(this.mockData.hostEmail);
    const hostAvatar = getRandomItem<string>(this.mockData.hostAvatar);
    const hostPassword = getRandomItem<string>(this.mockData.hostPassword);
    const hostIsPro = getRandomItem<boolean>(this.mockData.hostIsPro);
    const locationLat = getRandomItem<number>(this.mockData.locationLat);
    const locationLng = getRandomItem<number>(this.mockData.locationLng);
    const commentsCount = getRandomItem<number>(this.mockData.commentsCount);

    return [
      id,
      title,
      description,
      postDate,
      city,
      previewImage,
      images.join('|'),
      isPremium,
      isFavorite,
      rating,
      type,
      bedrooms,
      maxAdults,
      price,
      goods.join('|'),
      hostId,
      hostName,
      hostEmail,
      hostAvatar,
      hostPassword,
      hostIsPro,
      locationLat,
      locationLng,
      commentsCount,
    ].join('\t');
  }
}
