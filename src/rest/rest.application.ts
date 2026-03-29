import { inject, injectable } from 'inversify';
import { Config, RestSchema } from '../shared/libs/config/index.js';
import { Logger } from '../shared/libs/logger/logger.interface.js';
import { Component } from '../shared/types/container.js';
import { DatabaseClient } from '../shared/libs/database-client/index.js';
import { getMongoUri } from '../shared/helpers/database-client.js';
import { UserServiceInterface } from '../shared/modules/user/user-service.interface.js';
import { OfferService } from '../shared/modules/offer/offer-service.js';
import { CommentServiceInterface } from '../shared/modules/comment/comment-service.interface.js';

@injectable()
export class RestApplication {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.DatabaseClient)
    private readonly databaseClient: DatabaseClient,
    @inject(Component.UserService)
    private readonly userService: UserServiceInterface,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.CommentService)
    private readonly commentService: CommentServiceInterface,
  ) {}

  private async _initDB() {
    const mongoURI = getMongoUri(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME'),
    );

    return this.databaseClient.connect(mongoURI);
  }

  public async init() {
    this.logger.info('Application initialization');
    this.logger.info(`GET value from env $PORT: ${this.config.get('PORT')}`);

    this.logger.info('Database initialization');
    await this._initDB();
    this.logger.info('Init database completed');

    const email = 'anna.de.vries@example.com';

    let user = await this.userService.findByEmail(email);

    if (!user) {
      user = await this.userService.register(
        {
          name: 'Anna de Vries',
          email,
          avatar: 'https://example.com/avatars/anna.webp',
          password: 'secret123',
          isPro: true,
        },
        'salt',
      );
      this.logger.info(`Test user created: ${user.email}`);
    } else {
      this.logger.info(`Test user already exists: ${user.email}`);
    }

    const comment = await this.commentService.createComment({
      text: 'test comment',
      offerId: '69c8e7ea42abeb55d32a7545',
      author: user.id,
      rating: 5,
      date: new Date(),
    });

    console.log(comment);

    const offer = await this.offerService.findOfferById(
      '69c8e7ea42abeb55d32a7545',
    );

    console.log(offer);

    // const favorites = await this.userService.findFavoriteOffers(user.id);

    // console.log(favorites);

    // const offer = await this.offerService.updateById(
    //   "69c8e7ea42abeb55d32a7545",
    //   { isPremium: false },
    // );

    // console.log(offer);
  }
}
