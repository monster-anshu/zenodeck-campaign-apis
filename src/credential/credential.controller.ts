import { Body, Controller, Patch, Post } from '@nestjs/common';
import { GetSession } from '~/session/session.decorator';
import { CredentialService } from './credential.service';
import { AddCredentialDto } from './dto/add-credential.dto';
import { EditCredentialDto } from './dto/edit-credential.dto';

@Controller('credential')
export class CredentialController {
  constructor(private readonly credentialService: CredentialService) {}

  @Post()
  async add(
    @Body() body: AddCredentialDto,
    @GetSession('appId') appId: string,
    @GetSession('userId') userId: string
  ) {
    const credential = await this.credentialService.add(userId, appId, body);

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
    const credential = await this.credentialService.edit(userId, appId, body);

    return {
      isSuccess: true,
      credential,
    };
  }
}
