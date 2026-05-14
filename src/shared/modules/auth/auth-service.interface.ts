import { LoginUserDTO, UserEntity } from '../user/index.js';

export interface AuthServiceInterface {
  authenticate(user: UserEntity): Promise<string>;
  verify(dto: LoginUserDTO): Promise<UserEntity | null>;
}
