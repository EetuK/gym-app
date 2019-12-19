import Joi from "@hapi/joi";
import { JSONCookies } from "cookie-parser";

export const validate = (schema: object, value: any) =>
  Joi.object(schema).validate(value);

export const requiredFirstnameValidator = {
  firstname: Joi.string().required()
};

export const requiredLastnameValidator = {
  lastname: Joi.string().required()
};

export const requiredEmailValidator = {
  email: Joi.string()
    .email()
    .required()
};

export const requiredPasswordValidator = {
  password: Joi.string().required()
};

export const requiredNameValidator = {
  name: Joi.string().required()
};

export const requiredInfoValidator = {
  info: Joi.string().required()
};

export const requiredMoveIdValidator = {
  id: Joi.number().required()
};
