import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { InstallmentsModule } from './installments/installments.module';
import { PaymentsModule } from './payments/payments.module';
import { ServiceModule } from './service/service.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    InstallmentsModule,
    PaymentsModule,
    ServiceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
