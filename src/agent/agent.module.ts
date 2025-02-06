import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AgentSchema, AgentSchemaName } from '~/mongo/campaign';
import { ConnectionName } from '~/mongo/connections';
import { RoleModule } from '~/role/role.module';
import { AgentController } from './agent.controller';
import { AgentService } from './agent.service';

const AgentFeature = MongooseModule.forFeature(
  [
    {
      name: AgentSchemaName,
      schema: AgentSchema,
    },
  ],
  ConnectionName.DEFAULT
);

@Global()
@Module({
  controllers: [AgentController],
  providers: [AgentService],
  exports: [AgentService],
  imports: [AgentFeature, RoleModule],
})
export class AgentModule {}
