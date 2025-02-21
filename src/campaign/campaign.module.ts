import { Module } from '@nestjs/common';
import { LeadListModule } from '~/lead-list/lead-list.module';
import { CampaignModelProvider } from '~/mongo/campaign/nest';
import { CampaignController } from './campaign.controller';
import { CampaignService } from './campaign.service';

@Module({
  imports: [LeadListModule],
  controllers: [CampaignController],
  providers: [CampaignModelProvider, CampaignService],
})
export class CampaignModule {}
