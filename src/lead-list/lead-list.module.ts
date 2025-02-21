import { Module } from '@nestjs/common';
import { LeadModule } from '~/lead/lead.module';
import { LeadListModelProvider } from '~/mongo/campaign/nest';
import { LeadListController } from './lead-list.controller';
import { LeadsListService } from './lead-list.service';

@Module({
  imports: [LeadModule],
  providers: [LeadsListService, LeadListModelProvider],
  controllers: [LeadListController],
  exports: [LeadsListService],
})
export class LeadListModule {}
