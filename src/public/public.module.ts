import { Module } from '@nestjs/common';
import { HistoryModule } from '~/history/history.module';
import {
  EmailLinkClickModelProvider,
  EmailOpenEventModelProvider,
} from '~/mongo/campaign/nest';
import { PublicController } from './public.controller';
import { PublicService } from './public.service';

@Module({
  controllers: [PublicController],
  providers: [
    PublicService,
    EmailOpenEventModelProvider,
    EmailLinkClickModelProvider,
  ],
  imports: [HistoryModule],
})
export class PublicModule {}
