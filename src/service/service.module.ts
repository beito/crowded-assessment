import { Module, Logger } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Service } from './models/service.model';
import { ServiceService } from './service.service';

@Module({
  imports: [SequelizeModule.forFeature([Service])],
  providers: [
    ServiceService,
    {
      provide: 'MODULE_LOGGER',
      useFactory: () => {
        const logger = new Logger(ServiceModule.name);
        logger.log('ServiceModule initialized');
        return logger;
      },
    },
  ],
  exports: [ServiceService],
})
export class ServiceModule {}
