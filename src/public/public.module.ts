import { Module } from '@nestjs/common';
import { HistoryFeature } from '~/history/history.module';
import { MailModule } from '~/mail/mail.module';
import { PublicController } from './public.controller';
import { PublicService } from './public.service';

@Module({
  controllers: [PublicController],
  providers: [PublicService],
  imports: [MailModule, HistoryFeature],
})
export class PublicModule {}
