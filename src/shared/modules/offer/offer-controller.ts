import { inject } from "inversify";
import { BaseController } from "../../libs/rest/controller/base-controller.abstract.js";
import { Component } from "../../types/container.js";
import { OfferServiceInterface } from "./offer-service.interface.js";
import { HttpMethod } from "../../libs/rest/index.js";
import { Request, Response } from "express";
import { Logger } from "../../libs/logger/index.js";
import { fillDTO } from "../../helpers/common.js";
import { OfferRDO } from "./rdo/offer.rdo.js";
import { StatusCodes } from "http-status-codes";

export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService)
    private readonly offerService: OfferServiceInterface,
  ) {
    super(logger);

    this.addRoute({ path: "/", method: HttpMethod.Get, handler: this.index });
    this.addRoute({ path: "/", method: HttpMethod.Post, handler: this.create });
    this.addRoute({
      path: "/:id",
      method: HttpMethod.Put,
      handler: this.update,
    });
    this.addRoute({
      path: "/:id",
      method: HttpMethod.Delete,
      handler: this.delete,
    });
  }

  public async index(req: Request, res: Response) {
    console.log(req.body);
    const offers = await this.offerService.find();
    const responseData = fillDTO(OfferRDO, offers);
    this.ok(res, responseData);
  }

  public async create(req: Request, res: Response): Promise<void> {
    const existOffer = await this.offerService.findOfferById(req.body.id);
    console.log(req.body);

    if (existOffer) {
      const error = new Error(`Offer with id ${req.body.id} already exists`);
      this.send(res, StatusCodes.UNPROCESSABLE_ENTITY, {
        error: error.message,
      });

      return this.logger.error(error.message, error);
    }

    const result = await this.offerService.createOffer(req.body);
    this.created(res, fillDTO(OfferRDO, result));
  }

  public async update(req: Request, res: Response) {
    const updateOffer = await this.offerService.updateById(
      req.params.id as string,
      req.body,
    );

    if (!updateOffer) {
      const error = new Error(`Offer with id ${req.params.id} not found`);
      this.send(res, StatusCodes.NOT_FOUND, { error: error.message });

      return this.logger.error(error.message, error);
    }
    this.ok(res, fillDTO(OfferRDO, updateOffer));
  }

  public async delete(req: Request, res: Response) {
    const offer = await this.offerService.findOfferById(
      req.params.id as string,
    );

    if (!offer) {
      const error = new Error(`Offer with id ${req.params.id} not found`);
      this.send(res, StatusCodes.NOT_FOUND, { error: error.message });

      return this.logger.error(error.message, error);
    }
    const result = await this.offerService.deleteById(offer.id);
    this.noContent(res, fillDTO(OfferRDO, result));
  }
}
