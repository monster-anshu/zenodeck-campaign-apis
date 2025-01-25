import { Module } from '@nestjs/common';
import { CredentialModule } from '~/credential/credential.module';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';

@Module({
  controllers: [MailController],
  providers: [MailService],
  imports: [CredentialModule],
})
export class MailModule {}
