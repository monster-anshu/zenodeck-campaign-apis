import { Body, Controller, Patch, UseGuards } from '@nestjs/common';
import { AgentGuard } from '~/agent/agent.guard';
import { GetSession } from '~/session/session.decorator';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { LeadService } from './lead.service';

@UseGuards(AgentGuard)
@Controller('lead')
export class LeadController {
  constructor(private readonly leadService: LeadService) {}

  @Patch()
  async update(
    @GetSession('appId') appId: string,
    @GetSession('userId') userId: string,
    @Body() body: UpdateLeadDto
  ) {
    const lead = await this.leadService.update(appId, body);

    return {
      isSuccess: true,
      lead,
    };
  }
}
