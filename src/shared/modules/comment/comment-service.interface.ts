import { CommentEntity } from './comment.entity.js';
import { CommentDto } from './dto/comment-dto.js';

export interface CommentServiceInterface {
  createComment(dto: CommentDto): Promise<CommentEntity>
  findByOfferId(offerId: string): Promise<CommentEntity[]>
  deleteByOfferId(offerId: string): Promise<number>
}
