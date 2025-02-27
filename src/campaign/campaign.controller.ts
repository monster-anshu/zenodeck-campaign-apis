import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AgentGuard } from '~/agent/agent.guard';
import { GetSession } from '~/session/session.decorator';
import { CampaignService } from './campaign.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { ListCampaignDto } from './dto/list-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';

@UseGuards(AgentGuard)
@Controller('campaign')
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @Get()
  async list(
    @GetSession('appId') appId: string,
    @Query() query: ListCampaignDto
  ) {
    const campaigns = await this.campaignService.list(appId, query);

    return {
      isSuccess: true,
      campaigns,
    };
  }

  @Get(':id')
  async getById(@GetSession('appId') appId: string, @Param('id') id: string) {
    const campaign = await this.campaignService.getById(appId, id);
    return {
      isSuccess: true,
      campaign,
    };
  }

  @Post()
  async create(
    @GetSession('appId') appId: string,
    @GetSession('userId') userId: string,
    @Body() body: CreateCampaignDto
  ) {
    const campaign = await this.campaignService.create(appId, userId, body);

    return {
      isSuccess: true,
      campaign,
    };
  }

  @Patch()
  async update(
    @GetSession('appId') appId: string,
    @GetSession('userId') userId: string,
    @Body() body: UpdateCampaignDto
  ) {
    const campaign = await this.campaignService.update(appId, userId, body);

    return {
      isSuccess: true,
      campaign,
    };
  }

  @Delete(':id')
  async delete(
    @GetSession('appId') appId: string,
    @GetSession('userId') userId: string,
    @Param('id') id: string
  ) {
    await this.campaignService.delete(appId, id);

    return {
      isSuccess: true,
    };
  }
}
