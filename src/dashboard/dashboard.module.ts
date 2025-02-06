import { Module } from '@nestjs/common';
import { CredentialModule } from '~/credential/credential.module';
import { MailModule } from '~/mail/mail.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  providers: [DashboardService],
  controllers: [DashboardController],
  imports: [MailModule, CredentialModule],
})
export class DashboardModule {}
