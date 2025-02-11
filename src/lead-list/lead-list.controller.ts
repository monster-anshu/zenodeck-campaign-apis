import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AgentGuard } from '~/agent/agent.guard';
import { GetSession } from '~/session/session.decorator';
import { CreateLeadListDto } from './dto/create-lead-list.dto';
import { ImportLeadDto } from './dto/import-lead-list.dto';
import { LeadsListService } from './lead-list.service';

@UseGuards(AgentGuard)
@Controller('leads')
export class LeadListController {
  constructor(private readonly leadListService: LeadsListService) {}

  @Get()
  async list(
    @GetSession('appId') appId: string,
    @GetSession('userId') userId: string
  ) {
    const leadLists = await this.leadListService.list(appId);

    return {
      isSuccess: true,
      leadLists,
    };
  }

  @Post()
  async create(
    @GetSession('appId') appId: string,
    @GetSession('userId') userId: string,
    @Body() body: CreateLeadListDto
  ) {
    const leadList = await this.leadListService.create(appId, userId, body);

    return {
      isSuccess: true,
      leadList,
    };
  }

  @Post('import-lead')
  async import(
    @GetSession('appId') appId: string,
    @GetSession('userId') userId: string,
    @Body() body: ImportLeadDto
  ) {
    await this.leadListService.import(appId, userId, body);
    return {
      isSuccess: true,
    };
  }

  @Delete(':id')
  async remove(@GetSession('appId') appId: string, @Param('id') id: string) {
    await this.leadListService.remove(appId, id);

    return {
      isSuccess: true,
    };
  }
}
