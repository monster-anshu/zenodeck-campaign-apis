import { Module } from '@nestjs/common';
import { RoleModule } from '~/role/role.module';
import { InternalController } from './internal.controller';
import { InternalService } from './internal.service';

@Module({
  imports: [RoleModule],
  controllers: [InternalController],
  providers: [InternalService],
})
export class InternalModule {}
