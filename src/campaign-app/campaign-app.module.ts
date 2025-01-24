import { Global, Module } from '@nestjs/common';
import { CampaignAppController } from './campaign-app.controller';
import { CampaignAppService } from './campaign-app.service';

@Global()
@Module({
  controllers: [CampaignAppController],
  providers: [CampaignAppService],
  exports: [CampaignAppService],
})
export class CampaignAppModule {}
