import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HistorySchema, HistorySchemaName } from '~/mongo/campaign';
import { ConnectionName } from '~/mongo/connections';
import { HistoryService } from './history.service';

export const HistoryFeature = MongooseModule.forFeature(
  [{ name: HistorySchemaName, schema: HistorySchema }],
  ConnectionName.DEFAULT
);

@Module({
  imports: [HistoryFeature],
  providers: [HistoryService],
  exports: [HistoryService, HistoryFeature],
})
export class HistoryModule {}
