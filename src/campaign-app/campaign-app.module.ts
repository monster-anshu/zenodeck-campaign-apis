import { Module } from '@nestjs/common';
import { CampaignAppController } from './campaign-app.controller';
import { CampaignAppService } from './campaign-app.service';

@Module({
  controllers: [CampaignAppController],
  providers: [CampaignAppService],
  exports: [CampaignAppService],
})
export class CampaignAppModule {}
