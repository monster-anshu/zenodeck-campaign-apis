import { Global, Module } from '@nestjs/common';
import { CampaignAppModelProvider } from '~/mongo/campaign/nest';
import { CampaignAppController } from './campaign-app.controller';
import { CampaignAppService } from './campaign-app.service';

@Global()
@Module({
  controllers: [CampaignAppController],
  providers: [CampaignAppModelProvider, CampaignAppService],
  exports: [CampaignAppService],
})
export class CampaignAppModule {}
