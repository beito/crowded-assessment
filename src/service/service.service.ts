import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Service } from './models/service.model';

@Injectable()
export class ServiceService {
  private readonly logger = new Logger(ServiceService.name);

  constructor(@InjectModel(Service) private serviceModel: typeof Service) {}

  async getAllServices(): Promise<Service[]> {
    return this.serviceModel.findAll();
  }

  async createService(data: { name: string; price: number }): Promise<Service> {
    if (!data.name || !data.price) {
      this.logger.warn(`Invalid service data: ${JSON.stringify(data)}`);
      throw new NotFoundException('Service name and price are required.');
    }

    this.logger.log(`Creating service: ${data.name}`);
    return this.serviceModel.create(data);
  }
}
