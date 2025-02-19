import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CampaignSchema, CampaignSchemaName } from '~/mongo/campaign';
import { ConnectionName } from '~/mongo/connections';
import { CampaignController } from './campaign.controller';
import { CampaignService } from './campaign.service';

const CampaignFeature = MongooseModule.forFeature(
  [{ name: CampaignSchemaName, schema: CampaignSchema }],
  ConnectionName.DEFAULT
);

@Module({
  imports: [CampaignFeature],
  controllers: [CampaignController],
  providers: [CampaignService],
})
export class CampaignModule {}
