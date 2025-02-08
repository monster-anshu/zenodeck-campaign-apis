import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HistoryFeature } from '~/history/history.module';
import { MailModule } from '~/mail/mail.module';
import { CtrSchema, CtrSchemaName } from '~/mongo/campaign';
import { ConnectionName } from '~/mongo/connections';
import { PublicController } from './public.controller';
import { PublicService } from './public.service';

const CtrFeature = MongooseModule.forFeature(
  [{ name: CtrSchemaName, schema: CtrSchema }],
  ConnectionName.DEFAULT
);

@Module({
  controllers: [PublicController],
  providers: [PublicService],
  imports: [MailModule, HistoryFeature, CtrFeature],
})
export class PublicModule {}
