import { Module } from '@nestjs/common';
import { HistoryModelProvider } from '~/mongo/campaign/nest';
import { HistoryService } from './history.service';

@Module({
  imports: [],
  providers: [HistoryService, HistoryModelProvider],
  exports: [HistoryService],
})
export class HistoryModule {}
