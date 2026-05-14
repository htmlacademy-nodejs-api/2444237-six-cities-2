import { Expose } from 'class-transformer';

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

export class LoggedUserRDO {
  @Expose()
  public email: string;

  @Expose()
  public token: string;
}
