import { Container } from "inversify";
import { Component } from "../../types/container.js";
import { OfferServiceInterface } from "./offer-service.interface.js";
import { OfferService } from "./offer-service.js";
import { OfferEntity, OfferModel } from "./offer.entity.js";
import { types } from "@typegoose/typegoose";
import { Controller } from "../../libs/rest/controller/controller.interface.js";
import { OfferController } from "./offer-controller.js";

export function createOfferContainer() {
  const offerContainer = new Container();

  offerContainer
    .bind<OfferServiceInterface>(Component.OfferService)
    .to(OfferService)
    .inSingletonScope();
  offerContainer
    .bind<types.ModelType<OfferEntity>>(Component.OfferModel)
    .toConstantValue(OfferModel);
  offerContainer
    .bind<Controller>(Component.OfferController)
    .to(OfferController)
    .inSingletonScope();

  return offerContainer;
}
