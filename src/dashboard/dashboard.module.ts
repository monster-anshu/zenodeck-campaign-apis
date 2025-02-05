import { Module } from '@nestjs/common';
import { MailModule } from '~/mail/mail.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  providers: [DashboardService],
  controllers: [DashboardController],
  imports: [MailModule],
})
export class DashboardModule {}
