import { inject, injectable } from 'inversify';
import { LoginUserDTO, UserEntity } from '../user/index.js';
import { AuthServiceInterface } from './auth-service.interface.js';
import { Component } from '../../types/container.js';
import { Logger } from '../../libs/logger/index.js';
import { UserService } from '../user/user-service.js';
import { Config, RestSchema } from '../../libs/config/index.js';
import * as crypto from 'node:crypto';
import { TokenPayload } from './types/TokenPayload.js';
import { SignJWT } from 'jose';
import { JWT_ALGORITHM, JWT_EXPIRED } from './auth.constant.js';
import {
  UserNotFoundException,
  UserPasswordIncorrectException,
} from './errors/index.js';

@injectable()
export class DefaultAuthService implements AuthServiceInterface {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
  ) {}

  public async authenticate(user: UserEntity): Promise<string> {
    const secret = this.config.get('JWT_SECRET');
    const secretKey = crypto.createSecretKey(secret, 'utf-8');

    const tokenPayload: TokenPayload = {
      email: user.email,
      name: user.name,
      id: user._id.toString(),
    };

    this.logger.info(`Create token for ${user.email}`);

    return new SignJWT(tokenPayload)
      .setProtectedHeader({ alg: JWT_ALGORITHM })
      .setIssuedAt()
      .setExpirationTime(JWT_EXPIRED)
      .sign(secretKey);
  }

  public async verify(dto: LoginUserDTO): Promise<UserEntity | null> {
    const user = await this.userService.findByEmail(dto.email);

    if (!user) {
      this.logger.warn(`User with ${dto.email} not found`);
      throw new UserNotFoundException();
    }

    if (!user.verifyPassword(dto.password, this.config.get('SALT'))) {
      this.logger.warn(`Incorrect password for user ${dto.email}`);
      throw new UserPasswordIncorrectException();
    }

    return user;
  }
}
