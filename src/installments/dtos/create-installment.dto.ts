import * as Joi from 'joi';

export const CreateInstallmentDtoSchema = Joi.object({
  serviceId: Joi.number().required(),
  totalAmount: Joi.number().positive().required(),
  installmentsCount: Joi.number().integer().min(1).required(),
});