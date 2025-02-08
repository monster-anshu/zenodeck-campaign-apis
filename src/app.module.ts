import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AgentModule } from '~/agent/agent.module';
import { AppController } from '~/app.controller';
import { AppService } from '~/app.service';
import { CampaignAppModule } from '~/campaign-app/campaign-app.module';
import { InternalModule } from '~/internal/internal.module';
import { RoleModule } from '~/role/role.module';
import { CredentialModule } from './credential/credential.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { MONGO_COMMON_URI, MONGO_DEFAULT_URI } from './env';
import { FileModule } from './file/file.module';
import { HistoryModule } from './history/history.module';
import { MailModule } from './mail/mail.module';
import { ConnectionName } from './mongo/connections';
import { PublicModule } from './public/public.module';

@Module({
  imports: [
    MongooseModule.forRoot(MONGO_DEFAULT_URI, {
      connectionName: ConnectionName.DEFAULT,
    }),
    // MongooseModule.forRoot(MONGO_COMMON_URI, {
    //   connectionName: ConnectionName.COMMON,
    // }),
    InternalModule,
    AgentModule,
    RoleModule,
    CampaignAppModule,
    CredentialModule,
    MailModule,
    FileModule,
    DashboardModule,
    PublicModule,
    HistoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
