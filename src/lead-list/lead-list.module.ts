import { Module } from '@nestjs/common';
import { LeadModule } from '~/lead/lead.module';
import {
  CampaignModelProvider,
  LeadListModelProvider,
} from '~/mongo/campaign/nest';
import { LeadListController } from './lead-list.controller';
import { LeadsListService } from './lead-list.service';

@Module({
  imports: [LeadModule],
  providers: [LeadsListService, LeadListModelProvider, CampaignModelProvider],
  controllers: [LeadListController],
  exports: [LeadsListService],
})
export class LeadListModule {}
