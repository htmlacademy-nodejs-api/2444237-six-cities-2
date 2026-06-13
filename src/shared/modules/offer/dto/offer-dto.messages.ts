export const OfferDTOValidationMessage = {
  title: {
    minLength: 'Title must be at least 10 characters long.',
    maxLength: 'Title must be at most 100 characters long.',
  },
  description: {
    minLength: 'Description must be at least 20 characters long.',
    maxLength: 'Description must be at most 1024 characters long.',
  },
  date: {
    isDate: 'Date must be a valid date.',
  },

  city: {
    isEnum:
      'City must be one of: "Paris", "Cologne", "Brussels", "Amsterdam", "Hamburg", "Dusseldorf".',
  },

  imagePreview: {
    isString: 'Image preview must be a string.',
  },

  images: {
    isArray: 'Images must be an array.',
  },

  isPremium: {
    isBoolean: 'Is premium must be a boolean.',
  },

  isFavorite: {
    isBoolean: 'Is favorite must be a boolean.',
  },

  rating: {
    min: 'Rating must be at least 1.',
    max: 'Rating must be at most 5.',
  },

  type: {
    isEnum: 'Type must be one of: "Apartment", "House", "Hotel".',
  },

  bedrooms: {
    min: 'Bedrooms must be at least 1.',
    max: 'Bedrooms must be at most 5.',
  },

  maxAdults: {
    min: 'Max adults must be at least 1.',
    max: 'Max adults must be at most 5.',
  },

  price: {
    min: 'Price must be at least 1.',
    max: 'Price must be at most 100000.',
  },

  goods: {
    isArray: 'Goods must be an array.',
    isEnum: 'Goods must be an array.',
  },

  host: {
    isMongoId: 'Host must be a valid mongo id.',
  },

  commentsCount: {
    isInt: 'Comments count must be an integer.',
  },

  location: {
    isObject: 'Location must be an object.',
  },
};
