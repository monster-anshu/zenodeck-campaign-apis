import { Global, Module } from '@nestjs/common';
import { AgentModelProvider } from '~/mongo/campaign/nest';
import { RoleModule } from '~/role/role.module';
import { AgentController } from './agent.controller';
import { AgentService } from './agent.service';

@Global()
@Module({
  controllers: [AgentController],
  providers: [AgentModelProvider, AgentService],
  exports: [AgentService],
  imports: [RoleModule],
})
export class AgentModule {}
