import * as Joi from 'joi';

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthenticatedUser {
  userId: number;
  email: string;
}

export const LoginDtoSchema: Joi.ObjectSchema<LoginDto> = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});
