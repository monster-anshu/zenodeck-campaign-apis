import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CredentialSchema, CredentialSchemaName } from '~/mongo/campaign';
import { ConnectionName } from '~/mongo/connections';
import { CredentialController } from './credential.controller';
import { CredentialService } from './credential.service';

const CredentialFeature = MongooseModule.forFeature(
  [
    {
      name: CredentialSchemaName,
      schema: CredentialSchema,
    },
  ],
  ConnectionName.DEFAULT
);

@Module({
  imports: [CredentialFeature],
  controllers: [CredentialController],
  providers: [CredentialService],
  exports: [CredentialService],
})
export class CredentialModule {}
