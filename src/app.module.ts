import { Module } from '@nestjs/common';
import { AgentModule } from '~/agent/agent.module';
import { AppController } from '~/app.controller';
import { AppService } from '~/app.service';
import { CampaignAppModule } from '~/campaign-app/campaign-app.module';
import { InternalModule } from '~/internal/internal.module';
import { RoleModule } from '~/role/role.module';
import { CredentialModule } from './credential/credential.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { FileModule } from './file/file.module';
import { MailModule } from './mail/mail.module';
import { PublicModule } from './public/public.module';

@Module({
  imports: [
    InternalModule,
    AgentModule,
    RoleModule,
    CampaignAppModule,
    CredentialModule,
    MailModule,
    FileModule,
    DashboardModule,
    PublicModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
