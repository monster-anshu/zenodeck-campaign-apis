import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CampaignAppSchema, CampaignAppSchemaName } from '~/mongo/campaign';
import { ConnectionName } from '~/mongo/connections';
import { CampaignAppController } from './campaign-app.controller';
import { CampaignAppService } from './campaign-app.service';

const CampaignAppSchemaFeature = MongooseModule.forFeature(
  [
    {
      name: CampaignAppSchemaName,
      schema: CampaignAppSchema,
    },
  ],
  ConnectionName.DEFAULT
);

@Global()
@Module({
  imports: [CampaignAppSchemaFeature],
  controllers: [CampaignAppController],
  providers: [CampaignAppService],
  exports: [CampaignAppService],
})
export class CampaignAppModule {}
