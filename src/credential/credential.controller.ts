import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AgentGuard } from '~/agent/agent.guard';
import { CampaignApp } from '~/mongo/campaign';
import { GetCampaignApp, GetSession } from '~/session/session.decorator';
import { CredentialService } from './credential.service';
import { AddCredentialDto } from './dto/add-credential.dto';
import { EditCredentialDto } from './dto/edit-credential.dto';

@UseGuards(AgentGuard)
@Controller('credential')
export class CredentialController {
  constructor(private readonly credentialService: CredentialService) {}

  @Get()
  async list(
    @GetSession('appId') appId: string,
    @GetCampaignApp() campaignApp: CampaignApp,
    @Query('decrypt') decrypt: string
  ) {
    const credentials = await this.credentialService.list(
      appId,
      decrypt === 'true' ? campaignApp : null
    );

    return {
      isSuccess: true,
      credentials,
    };
  }

  @Get(':id')
  async getById(
    @GetSession('appId') appId: string,
    @Param('id') id: string,
    @GetCampaignApp() campaignApp: CampaignApp
  ) {
    const credential = await this.credentialService.getById(
      appId,
      id,
      campaignApp
    );

    return {
      isSuccess: true,
      credential,
    };
  }

  @Post()
  async add(
    @Body() body: AddCredentialDto,
    @GetSession('appId') appId: string,
    @GetSession('userId') userId: string,
    @GetCampaignApp() campaignApp: CampaignApp
  ) {
    const credential = await this.credentialService.add(
      appId,
      userId,
      body,
      campaignApp
    );

    return {
      isSuccess: true,
      credential,
    };
  }

  @Patch()
  async edit(
    @Body() body: EditCredentialDto,
    @GetSession('appId') appId: string,
    @GetSession('userId') userId: string,
    @GetCampaignApp() campaignApp: CampaignApp
  ) {
    const credential = await this.credentialService.edit(
      appId,
      userId,
      body,
      campaignApp
    );

    if (!credential) {
      throw new NotFoundException();
    }

    return {
      isSuccess: true,
      credential,
    };
  }

  @Delete(':id')
  async delete(@GetSession('appId') appId: string, @Param('id') id: string) {
    const credential = await this.credentialService.delete(appId, id);

    if (!credential) {
      throw new NotFoundException();
    }

    return {
      isSuccess: true,
    };
  }
}
