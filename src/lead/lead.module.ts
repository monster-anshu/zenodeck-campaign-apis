import { Module } from '@nestjs/common';
import { LeadModelProvider } from '~/mongo/campaign/nest';
import { LeadController } from './lead.controller';
import { LeadService } from './lead.service';

@Module({
  providers: [LeadService, LeadModelProvider],
  controllers: [LeadController],
  exports: [LeadService],
})
export class LeadModule {}
