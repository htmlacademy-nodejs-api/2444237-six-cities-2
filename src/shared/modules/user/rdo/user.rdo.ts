import { Expose } from "class-transformer";

export class UserRDO {
  @Expose()
  name: string;
  @Expose()
  email: string;
  @Expose()
  avatar: string;
  @Expose()
  isPro: boolean;
  @Expose()
  favorites: string[];
}
