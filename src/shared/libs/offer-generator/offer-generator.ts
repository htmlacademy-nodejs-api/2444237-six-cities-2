import { generateRandomValue, getRandomItem } from '../../helpers/common.js';
import { MockServerData } from '../../types/mock-server.js';
import { CITY_COORDINATES, CityCoordinates } from '../../types/offer.js';
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
    const images = getRandomItem<string>(this.mockData.images);
    const isPremium = getRandomItem<boolean>(this.mockData.isPremium);
    const isFavorite = getRandomItem<boolean>(this.mockData.isFavorite);
    const rating = getRandomItem<number>(this.mockData.rating);
    const type = getRandomItem<string>(this.mockData.type);
    const bedrooms = generateRandomValue(MIN_BEDROOMS, MAX_BEDROOMS);
    const maxAdults = generateRandomValue(MIN_ADULTS, MAX_ADULTS);
    const price = generateRandomValue(MIN_PRICE, MAX_PRICE);
    const goods = getRandomItem<string>(this.mockData.goods);
    const hostId = getRandomItem<number>(this.mockData.hostId);
    const hostName = getRandomItem<string>(this.mockData.hostName);
    const hostEmail = getRandomItem<string>(this.mockData.hostEmail);
    const hostAvatar = getRandomItem<string>(this.mockData.hostAvatar);
    const hostPassword = getRandomItem<string>(this.mockData.hostPassword);
    const hostIsPro = getRandomItem<boolean>(this.mockData.hostIsPro);
    const coordies = (CITY_COORDINATES as CityCoordinates)[city];
    const locationLat = coordies.lat;
    const locationLng = coordies.lng;
    const commentsCount = getRandomItem<number>(this.mockData.commentsCount);

    return [
      id,
      title,
      description,
      postDate,
      city,
      previewImage,
      images,
      isPremium,
      isFavorite,
      rating,
      type,
      bedrooms,
      maxAdults,
      price,
      goods,
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
