import * as Joi from 'joi';

export const CreateInstallmentDtoSchema = Joi.object({
  serviceId: Joi.number().required(),
  totalAmount: Joi.number().positive().required(),
  installments: Joi.array()
    .items(
      Joi.object({
        dueDate: Joi.date().iso().required(),
        amount: Joi.number().positive().required(),
      })
    )
    .min(1)
    .required(),
});
