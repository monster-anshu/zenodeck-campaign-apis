import { Body, Controller, Post } from '@nestjs/common';
import { GetSession } from '~/session/session.decorator';
import { CreateLeadListDto } from './dto/create-lead-list.dto';
import { ImportLeadDto } from './dto/import-lead-list.dto';
import { LeadsListService } from './lead-list.service';

@Controller('leads')
export class LeadListController {
  constructor(private readonly leadListService: LeadsListService) {}

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
}
