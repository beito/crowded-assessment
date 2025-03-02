import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Service } from './models/service.model';

@Injectable()
export class ServiceService {
  constructor(@InjectModel(Service) private serviceModel: typeof Service) {}

  async getAllServices(): Promise<Service[]> {
    return this.serviceModel.findAll();
  }

  async createService(data: { name: string; price: number }): Promise<Service> {
    return this.serviceModel.create(data);
  }
}
