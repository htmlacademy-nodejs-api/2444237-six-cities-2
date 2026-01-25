export type User = {
  id: number;
  name: string;
  email: string;
  avatar: string;
  password: string;
  isPro: boolean;
};

export type Location = {
  latitude: number;
  longitude: number;
};

export type City =
  | "Paris"
  | "Cologne"
  | "Brussels"
  | "Amsterdam"
  | "Hamburg"
  | "Dusseldorf";

export type HousingType = "apartment" | "house" | "room" | "hotel";

export type Amenity =
  | "Breakfast"
  | "Air conditioning"
  | "Laptop friendly workspace"
  | "Baby seat"
  | "Washer"
  | "Towels"
  | "Fridge";

export type Offer = {
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
};
