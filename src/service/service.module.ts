import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Service } from './models/service.model';
import { ServiceService } from './service.service';

@Module({
  imports: [SequelizeModule.forFeature([Service])],
  providers: [ServiceService],
  exports: [ServiceService], // Exporta para que otros módulos puedan usarlo
})
export class ServiceModule {}
