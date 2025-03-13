import { Module, Logger } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { InstallmentsController } from './installments.controller';
import { InstallmentsService } from './installments.service';
import { Installment } from './models/installment.model';
import { InstallmentPlan } from './models/installment-plan.model';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Installment, InstallmentPlan]),
    AuthModule,
  ],
  controllers: [InstallmentsController],
  providers: [
    InstallmentsService,
    JwtAuthGuard,
    {
      provide: 'MODULE_LOGGER',
      useFactory: () => {
        const logger = new Logger(InstallmentsModule.name);
        logger.log('InstallmentsModule initialized');
        return logger;
      },
    },
  ],
  exports: [InstallmentsService, SequelizeModule],
})
export class InstallmentsModule {}
