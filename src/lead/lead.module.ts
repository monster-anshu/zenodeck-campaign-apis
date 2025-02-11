import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LeadSchema, LeadSchemaName } from '~/mongo/campaign';
import { ConnectionName } from '~/mongo/connections';
import { LeadController } from './lead.controller';
import { LeadService } from './lead.service';

export const LeadFeature = MongooseModule.forFeature(
  [{ name: LeadSchemaName, schema: LeadSchema }],
  ConnectionName.DEFAULT
);

@Module({
  imports: [LeadFeature],
  providers: [LeadService],
  controllers: [LeadController],
  exports: [LeadService],
})
export class LeadModule {}
