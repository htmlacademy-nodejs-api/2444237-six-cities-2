import { CommentEntity } from './comment.entity.js';
import { CommentDto } from './dto/comment-dto.js';

export interface CommentServiceInterface {
  create(dto: CommentDto, offerId: string): Promise<CommentEntity>;
  findById(offerId: string): Promise<CommentEntity[]>;
  deleteById(offerId: string): Promise<number>;
}
