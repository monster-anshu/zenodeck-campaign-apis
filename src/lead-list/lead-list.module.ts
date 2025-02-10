import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  LeadListName,
  LeadListSchema,
  LeadSchema,
  LeadSchemaName,
} from '~/mongo/campaign';
import { ConnectionName } from '~/mongo/connections';
import { LeadListController } from './lead-list.controller';
import { LeadsListService } from './lead-list.service';

const LeadListFeature = MongooseModule.forFeature(
  [{ name: LeadListName, schema: LeadListSchema }],
  ConnectionName.DEFAULT
);

const LeadFeature = MongooseModule.forFeature(
  [{ name: LeadSchemaName, schema: LeadSchema }],
  ConnectionName.DEFAULT
);

@Module({
  imports: [LeadListFeature, LeadFeature],
  providers: [LeadsListService],
  controllers: [LeadListController],
})
export class LeadListModule {}
