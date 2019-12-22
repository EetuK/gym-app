import Joi from "@hapi/joi";

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

export const optionalInfoValidator = {
  info: Joi.string().optional()
};

export const requiredMoveIdValidator = {
  moveId: Joi.number().required()
};

export const requiredWorkoutIdValidator = {
  workoutId: Joi.number().required()
};

export const requiredMoveIdArrayValidator = {
  moves: Joi.array()
    .items(Joi.string())
    .required()
};

export const requiredWorkoutExecutionIdValidator = {
  workoutExecutionId: Joi.string().required()
};

export const requiredSetsValidator = {
  sets: Joi.number().required()
};

export const requiredRepsValidator = {
  reps: Joi.number().required()
};

export const requiredWeightValidator = {
  weight: Joi.number().required()
};

export const requiredVibeValidator = {
  vibe: Joi.number()
    .min(1)
    .max(5)
    .required()
};

export const requiredRestingTimeValidator = {
  restingTime: Joi.number().required()
};
