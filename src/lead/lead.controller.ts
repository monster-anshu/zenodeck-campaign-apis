import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AgentGuard } from '~/agent/agent.guard';
import { GetSession } from '~/session/session.decorator';
import { ListLeadDto } from './dto/list-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { LeadService } from './lead.service';

@UseGuards(AgentGuard)
@Controller('lead')
export class LeadController {
  constructor(private readonly leadService: LeadService) {}

  @Get(':leadListId')
  async list(
    @GetSession('appId') appId: string,
    @Param('leadListId') leadListId: string,
    @Query() query: ListLeadDto
  ) {
    const leads = await this.leadService.list(appId, leadListId, {
      ...query,
      limit: query.limit + 1,
    });

    const slicedLeads = leads.slice(0, query.limit);

    const meta = {
      limit: query.limit,
      nextCursor:
        leads.length > query.limit ? slicedLeads.at(-1)?._id || null : null,
    };

    return {
      isSuccess: true,
      meta: meta,
      leads: slicedLeads,
    };
  }

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

  @Delete(':id')
  async remove(
    @GetSession('appId') appId: string,
    @GetSession('userId') userId: string,
    @Param('id') id: string
  ) {
    await this.leadService.remove(appId, id);
    return {
      isSuccess: true,
    };
  }
}
