import { readFileSync } from 'node:fs';
import { Amenity, City, HousingType, Offer } from '../../types/offer.js';

export class TSVFileReader {
  private rawData = '';

  constructor(private readonly filePath: string) {}

  public read(): void {
    this.rawData = readFileSync(this.filePath, 'utf-8');
  }

  public toArray(): Offer[] {
    if (!this.rawData) {
      throw new Error('No data. Call read() first.');
    }

    return this.rawData
      .split(/\r?\n/)
      .filter((row) => row.trim().length > 0)
      .slice(1)
      .map((line) => {
        const [
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
        ] = line.split('\t');

        return {
          title: title,
          description: description,
          date: new Date(postDate),
          city: city as City,
          imagePreview: previewImage,
          images: images.split('|'),
          isPremium: isPremium === 'true',
          isFavorite: isFavorite === 'true',
          rating: Number(rating),
          type: type as HousingType,
          bedrooms: Number(bedrooms),
          maxAdults: Number(maxAdults),
          price: Number(price),
          goods: goods.split('|').map((good) => good as Amenity),
          host: {
            id: Number(hostId),
            name: hostName,
            email: hostEmail,
            avatar: hostAvatar,
            password: hostPassword,
            isPro: hostIsPro === 'true',
          },
          commentsCount: Number(commentsCount),
          location: {
            latitude: Number(locationLat),
            longitude: Number(locationLng),
          },
        };
      });
  }
}
