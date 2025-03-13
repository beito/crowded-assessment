import { Module, Logger } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { Payment } from './models/payment.model';
import { Installment } from '../installments/models/installment.model';
import { InstallmentPlan } from '../installments/models/installment-plan.model';
import { InstallmentsModule } from '../installments/installments.module';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Payment, Installment, InstallmentPlan]),
    InstallmentsModule,
    AuthModule,
  ],
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    JwtAuthGuard,
    {
      provide: 'MODULE_LOGGER',
      useFactory: () => {
        const logger = new Logger(PaymentsModule.name);
        logger.log('PaymentsModule initialized');
        return logger;
      },
    },
  ],
})
export class PaymentsModule {}
