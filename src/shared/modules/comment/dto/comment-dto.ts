import { IsDateString, Max, MaxLength, Min, MinLength } from 'class-validator';
import { CommentDTOValidationMessage } from './comment-dto.messages.js';

export class CommentDto {
  @MinLength(5, { message: CommentDTOValidationMessage.text.min })
  @MaxLength(1024, { message: CommentDTOValidationMessage.text.max })
    text!: string;

  @Min(1, { message: CommentDTOValidationMessage.rating.min })
  @Max(5, { message: CommentDTOValidationMessage.rating.max })
    rating!: number;

  @IsDateString({}, { message: CommentDTOValidationMessage.date.isDate })
    date!: Date;
}
