import { Module, Logger } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { Payment } from './models/payment.model';
import { Installment } from '../installments/models/installment.model';
import { InstallmentsModule } from '../installments/installments.module';

@Module({
  imports: [SequelizeModule.forFeature([Payment, Installment]), InstallmentsModule],
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
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
