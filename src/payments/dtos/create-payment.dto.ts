import * as Joi from 'joi';

export const CreatePaymentDtoSchema = Joi.object({
  installmentId: Joi.number().required(),
  paymentMethod: Joi.string().valid('ACH', 'Card').required(),
  amount: Joi.number().positive().required(),
});

export interface CreatePaymentDto {
  installmentId: number;
  paymentMethod: 'ACH' | 'Card';
  amount: number;
}
