export type User = {
  id: number;
  name: string;
  email: string;
  avatar: string;
  password: string;
  isPro: boolean;
};

export class Location {
  public latitude: number;
  public longitude: number;
}

export const CITIES = [
  'Paris',
  'Cologne',
  'Brussels',
  'Amsterdam',
  'Hamburg',
  'Dusseldorf',
] as const;

export type City = (typeof CITIES)[number];

export const Amenities = [
  'Breakfast',
  'Air conditioning',
  'Laptop friendly workspace',
  'Baby seat',
  'Washer',
  'Towels',
  'Fridge',
] as const;

export type CityCoordinates = Record<string, { lat: number; lng: number }>;

export const CITY_COORDINATES: CityCoordinates = {
  Paris: { lat: 48.85661, lng: 2.351499 },
  Amsterdam: { lat: 52.370216, lng: 4.895168 },
  Cologne: { lat: 50.938361, lng: 6.959974 },
  Brussels: { lat: 50.846557, lng: 4.351697 },
  Hamburg: { lat: 53.550341, lng: 10.000654 },
  Dusseldorf: { lat: 51.225402, lng: 6.776314 },
} as const;

export type Amenity = (typeof Amenities)[number];

export const HousingTypes = ['apartment', 'house', 'room', 'hotel'] as const;

export type HousingType = (typeof HousingTypes)[number];

export interface Offer {
  id: string;
  title: string;
  description: string;
  date: Date;
  city: City;
  imagePreview: string;
  images: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  type: HousingType;
  bedrooms: number;
  maxAdults: number;
  price: number;
  goods: Amenity[];
  host: User;
  commentsCount: number;
  location: Location;
}
