import { Module } from '@nestjs/common';
import { CredentialModule } from '~/credential/credential.module';
import { HistoryModule } from '~/history/history.module';
import { LeadModule } from '~/lead/lead.module';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';

@Module({
  controllers: [MailController],
  providers: [MailService],
  imports: [CredentialModule, HistoryModule, LeadModule],
})
export class MailModule {}
