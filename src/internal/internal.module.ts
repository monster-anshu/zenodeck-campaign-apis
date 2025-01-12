import { Module } from '@nestjs/common';
import { CampaignAppModule } from '~/campaign-app/campaign-app.module';
import { RoleModule } from '~/role/role.module';
import { InternalController } from './internal.controller';
import { InternalService } from './internal.service';

@Module({
  imports: [RoleModule, CampaignAppModule],
  controllers: [InternalController],
  providers: [InternalService],
})
export class InternalModule {}
