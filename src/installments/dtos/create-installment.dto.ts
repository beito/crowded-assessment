import * as Joi from 'joi';

export interface CreateInstallmentDto {
  serviceId: number;
  totalAmount: number;
  installmentsCount: number;
}

export interface CompleteCreateInstallmentDto {
  serviceId: number;
  totalAmount: number;
  installmentsCount: number;
  userId: number;
}

export const CreateInstallmentDtoSchema: Joi.ObjectSchema<CreateInstallmentDto> =
  Joi.object({
    serviceId: Joi.number().required(),
    totalAmount: Joi.number().positive().required(),
    installmentsCount: Joi.number().integer().min(1).required(),
  });
