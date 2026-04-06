import { Container } from "inversify";
import { Component } from "../../types/container.js";
import { UserServiceInterface } from "./user-service.interface.js";
import { UserService } from "./user-service.js";
import { types } from "@typegoose/typegoose";
import { UserEntity, UserModel } from "./user.entity.js";
import { Controller } from "../../libs/rest/controller/controller.interface.js";
import { UserController } from "./user-controller.js";

export function createUserContainer() {
  const userContainer = new Container();

  userContainer
    .bind<UserServiceInterface>(Component.UserService)
    .to(UserService)
    .inSingletonScope();
  userContainer
    .bind<types.ModelType<UserEntity>>(Component.UserModel)
    .toConstantValue(UserModel);
  userContainer
    .bind<Controller>(Component.UserController)
    .to(UserController)
    .inSingletonScope();

  return userContainer;
}
