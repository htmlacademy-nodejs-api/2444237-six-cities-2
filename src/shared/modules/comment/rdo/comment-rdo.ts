import { Expose } from 'class-transformer';

export class CommentRDO {
  @Expose()
    text: string;

  @Expose()
    date!: Date;

  @Expose()
    rating!: number;

  @Expose()
    author!: string;
}
