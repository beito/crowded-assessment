import * as Joi from 'joi';

export const LoginDtoSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});
