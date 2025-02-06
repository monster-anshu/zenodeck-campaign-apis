import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleSchema, RoleSchemaName } from '~/mongo/campaign';
import { ConnectionName } from '~/mongo/connections';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';

const RoleFeature = MongooseModule.forFeature(
  [{ name: RoleSchemaName, schema: RoleSchema }],
  ConnectionName.DEFAULT
);

@Module({
  imports: [RoleFeature],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
