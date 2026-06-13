import { ModelType } from '@typegoose/typegoose/lib/types.js';
import { getErrorMessage } from '../shared/helpers/common.js';
import { getMongoUri } from '../shared/helpers/database-client.js';
import { create } from '../shared/helpers/offer.js';
import {
  DatabaseClient,
  MongoDatabaseClient,
} from '../shared/libs/database-client/index.js';
import { TSVFileReader } from '../shared/libs/file-reader/tsv-file-reader.js';
import { ConsoleLogger } from '../shared/libs/logger/console.logger.js';
import { OfferService } from '../shared/modules/offer/offer-service.js';
import { UserService } from '../shared/modules/user/user-service.js';
import { Offer } from '../shared/types/offer.js';
import { DEFAULT_DB_PORT, DEFAULT_USER_PASSWORD } from './const.cli.js';
import {
  OfferEntity,
  OfferModel,
} from '../shared/modules/offer/offer.entity.js';
import { UserEntity, UserModel } from '../shared/modules/user/user.entity.js';
import {
  CommentEntity,
  CommentModel,
} from '../shared/modules/comment/comment.entity.js';
import { Command } from './command.interface.js';

export class ImportCommand implements Command {
  private salt: string;
  private logger: ConsoleLogger;
  private userService: UserService;
  private offerService: OfferService;
  private databaseClient: DatabaseClient;
  private userModel: ModelType<UserEntity>;
  private offerModel: ModelType<OfferEntity>;
  private commentModel: ModelType<CommentEntity>;

  constructor() {
    this.logger = new ConsoleLogger();
    this.databaseClient = new MongoDatabaseClient(this.logger);
  }

  getName(): string {
    return '--import';
  }

  private initModels() {
    this.userModel = UserModel;
    this.offerModel = OfferModel;
    this.commentModel = CommentModel;

    this.userService = new UserService(this.logger, this.userModel);
    this.offerService = new OfferService(
      this.logger,
      this.offerModel,
      this.commentModel,
      this.userModel,
    );
  }

  private async onImportedLine(line: string, resolve: () => void) {
    const offer = create(line);
    await this.save(offer);
    resolve();
  }

  private onCompletedImport() {
    this.databaseClient.disconnect();
  }

  private async save(offer: Offer) {
    const { host, ...offerData } = offer;
    const user = await this.userService.register(
      { ...host, password: DEFAULT_USER_PASSWORD },
      this.salt,
    );
    await this.offerService.create({ ...offerData, host: user.id });
  }

  public async execute(
    filename: string,
    login: string,
    password: string,
    host: string,
    dbName: string,
    salt: string,
  ): Promise<void> {
    const dbURI = getMongoUri(login, password, host, DEFAULT_DB_PORT, dbName);
    this.salt = salt;

    await this.databaseClient.connect(dbURI);

    this.initModels();

    const fileReader = new TSVFileReader(filename.trim());

    fileReader.on('line', this.onImportedLine.bind(this));
    fileReader.on('end', this.onCompletedImport.bind(this));

    try {
      await fileReader.read();
    } catch (error) {
      console.error(getErrorMessage(error));
    }
  }
}
