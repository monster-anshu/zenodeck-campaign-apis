import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AgentGuard } from '~/agent/agent.guard';
import { GetSession } from '~/session/session.decorator';
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
    @GetSession('userId') userId: string
  ) {
    const credential = await this.credentialService.add(appId, userId, body);

    return {
      isSuccess: true,
      credential,
    };
  }

  @Patch()
  async edit(
    @Body() body: EditCredentialDto,
    @GetSession('appId') appId: string,
    @GetSession('userId') userId: string
  ) {
    const credential = await this.credentialService.edit(appId, userId, body);

    if (!credential) {
      throw new NotFoundException();
    }

    return {
      isSuccess: true,
      credential,
    };
  }
}
