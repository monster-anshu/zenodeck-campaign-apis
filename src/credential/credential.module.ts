import { Module } from '@nestjs/common';
import {
  CampaignModelProvider,
  CredentialModelProvider,
} from '~/mongo/campaign/nest';
import { CredentialController } from './credential.controller';
import { CredentialService } from './credential.service';

@Module({
  controllers: [CredentialController],
  providers: [
    CredentialModelProvider,
    CredentialService,
    CampaignModelProvider,
  ],
  exports: [CredentialService],
})
export class CredentialModule {}
