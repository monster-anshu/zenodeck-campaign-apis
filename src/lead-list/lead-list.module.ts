import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LeadModule } from '~/lead/lead.module';
import { LeadListName, LeadListSchema } from '~/mongo/campaign';
import { ConnectionName } from '~/mongo/connections';
import { LeadListController } from './lead-list.controller';
import { LeadsListService } from './lead-list.service';

const LeadListFeature = MongooseModule.forFeature(
  [{ name: LeadListName, schema: LeadListSchema }],
  ConnectionName.DEFAULT
);

@Module({
  imports: [LeadListFeature, LeadModule],
  providers: [LeadsListService],
  controllers: [LeadListController],
})
export class LeadListModule {}
