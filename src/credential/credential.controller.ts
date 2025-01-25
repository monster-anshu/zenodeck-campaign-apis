import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
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
  async list(@GetSession('appId') appId: string) {
    const credentials = await this.credentialService.list(appId);

    return {
      isSuccess: true,
      credentials,
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

  @Delete(':credentialId')
  async delete(
    @GetSession('appId') appId: string,
    @Param('credentialId') credentialId: string
  ) {
    const credential = await this.credentialService.delete(appId, credentialId);

    if (!credential) {
      throw new NotFoundException();
    }

    return {
      isSuccess: true,
    };
  }
}
