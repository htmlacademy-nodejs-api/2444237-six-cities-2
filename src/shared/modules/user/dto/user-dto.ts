export class CreateUserDto {
  public name: string;
  public email: string;
  public avatar: string;
  public password: string;
  public isPro: boolean;
}

export class LoginUserDTO {
  public email: string;
  public password: string;
}
