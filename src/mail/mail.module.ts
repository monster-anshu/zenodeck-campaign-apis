import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CredentialModule } from '~/credential/credential.module';
import { EmailHistorySchema, EmailHistorySchemaName } from '~/mongo/campaign';
import { ConnectionName } from '~/mongo/connections';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';

const EmailHistoryFeature = MongooseModule.forFeature(
  [{ name: EmailHistorySchemaName, schema: EmailHistorySchema }],
  ConnectionName.DEFAULT
);

@Module({
  controllers: [MailController],
  providers: [MailService],
  imports: [EmailHistoryFeature, CredentialModule],
  exports: [EmailHistoryFeature],
})
export class MailModule {}
