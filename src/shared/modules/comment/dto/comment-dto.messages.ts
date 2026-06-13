export const CommentDTOValidationMessage = {
  text: {
    isString: 'Comment text must be a string',
    min: 'Comment text must be at least 5 characters long',
    max: 'Comment text must be at most 1024 characters long',
  },

  offerId: {
    isMongoId: 'Offer id must be a valid mongo id',
  },

  author: {
    isMongoId: 'Author id must be a valid mongo id',
  },

  rating: {
    min: 'Rating must be at least 1',
    max: 'Rating must be at most 5',
  },

  date: {
    isDate: 'Date must be a valid date',
  },
};
