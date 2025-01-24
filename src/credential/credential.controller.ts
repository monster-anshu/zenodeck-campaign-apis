import { Body, Controller, Post } from '@nestjs/common';
import { GetSession } from '~/session/session.decorator';
import { CredentialService } from './credential.service';
import { AddCredentialDto } from './dto/add-credential.dto';

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
}
