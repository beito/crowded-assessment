import * as Joi from 'joi';

export interface CreatePaymentDto {
  installmentId: number;
  paymentMethod: 'ACH' | 'Card';
  amount: number;
}

export const CreatePaymentDtoSchema: Joi.ObjectSchema<CreatePaymentDto> =
  Joi.object({
    installmentId: Joi.number().required(),
    paymentMethod: Joi.string().valid('ACH', 'Card').required(),
    amount: Joi.number().positive().required(),
  });
