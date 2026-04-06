import { inject, injectable } from "inversify";
import { Config, RestSchema } from "../shared/libs/config/index.js";
import { Logger } from "../shared/libs/logger/logger.interface.js";
import { Component } from "../shared/types/container.js";
import { DatabaseClient } from "../shared/libs/database-client/index.js";
import { getMongoUri } from "../shared/helpers/database-client.js";
import { UserServiceInterface } from "../shared/modules/user/user-service.interface.js";
import { OfferService } from "../shared/modules/offer/offer-service.js";
import { CommentServiceInterface } from "../shared/modules/comment/comment-service.interface.js";
import express, { Express } from "express";
import { Controller } from "../shared/libs/rest/controller/controller.interface.js";
import { ExceptionFilter } from "../shared/libs/rest/exception-filter/exception-filter.interface.js";

@injectable()
export class RestApplication {
  private readonly server: Express;

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
    @inject(Component.OfferController)
    private readonly offerController: Controller,
    @inject(Component.UserController)
    private readonly userController: Controller,
    @inject(Component.ExceptionFilter)
    private readonly exceptionFilter: ExceptionFilter,
  ) {
    this.server = express();
  }

  private async _initDB() {
    const mongoURI = getMongoUri(
      this.config.get("DB_USER"),
      this.config.get("DB_PASSWORD"),
      this.config.get("DB_HOST"),
      this.config.get("DB_PORT"),
      this.config.get("DB_NAME"),
    );

    return this.databaseClient.connect(mongoURI);
  }

  private async _initMiddleware() {
    this.server.use(express.json());
  }

  private async _initControllers() {
    this.server.use("/offers", this.offerController.router);
    this.server.use("/users", this.userController.router);
  }

  private async _initServer() {
    const port = this.config.get("PORT");
    this.server.listen(port);
  }

  private __initExceptionFilters() {
    this.server.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
  }

  public async init() {
    this.logger.info("Application initialization");
    this.logger.info(`GET value from env $PORT: ${this.config.get("PORT")}`);

    this.logger.info("Init app-level middleware");
    await this._initMiddleware();
    this.logger.info("App-level middleware initialization completed");

    await this._initServer();
    await this._initControllers();

    await this.__initExceptionFilters();

    this.logger.info(
      `🚀 Server started on http://localhost:${this.config.get("PORT")}`,
    );

    this.logger.info("Database initialization");
    await this._initDB();
    this.logger.info("Init database completed");

    const email = "anna.de.vries@example.com";

    let user = await this.userService.findByEmail(email);

    if (!user) {
      user = await this.userService.register(
        {
          name: "Anna de Vries",
          email,
          avatar: "https://example.com/avatars/anna.webp",
          password: "secret123",
          isPro: true,
        },
        "salt",
      );
      this.logger.info(`Test user created: ${user.email}`);
    } else {
      this.logger.info(`Test user already exists: ${user.email}`);
    }

    console.log(this.commentService.findByOfferId("69c8e7ea42abeb55d32a7545"));

    const offer = await this.offerService.findOfferById(
      "69c8e7ea42abeb55d32a7545",
    );

    console.log(offer);
  }
}
