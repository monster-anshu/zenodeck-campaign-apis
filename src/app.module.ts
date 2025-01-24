import { Module } from '@nestjs/common';
import { AgentModule } from '~/agent/agent.module';
import { AppController } from '~/app.controller';
import { AppService } from '~/app.service';
import { CampaignAppModule } from '~/campaign-app/campaign-app.module';
import { InternalModule } from '~/internal/internal.module';
import { RoleModule } from '~/role/role.module';
import { CredentialModule } from './credential/credential.module';

@Module({
  imports: [
    InternalModule,
    AgentModule,
    RoleModule,
    CampaignAppModule,
    CredentialModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
