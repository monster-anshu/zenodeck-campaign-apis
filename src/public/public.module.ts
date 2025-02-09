import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HistoryModule } from '~/history/history.module';
import {
  EmailEvent,
  EmailEventSchema,
  EmailEventSchemaName,
  EmailLinkClickEventSchema,
  EmailOpenEventSchema,
} from '~/mongo/campaign';
import { ConnectionName } from '~/mongo/connections';
import { PublicController } from './public.controller';
import { PublicService } from './public.service';

export const EmailEventFeature = MongooseModule.forFeature(
  [
    {
      name: EmailEventSchemaName,
      schema: EmailEventSchema,
      discriminators: [
        { name: EmailEvent.OPEN, schema: EmailOpenEventSchema },
        { name: EmailEvent.CLICK, schema: EmailLinkClickEventSchema },
      ],
    },
  ],
  ConnectionName.DEFAULT
);

@Module({
  controllers: [PublicController],
  providers: [PublicService],
  imports: [HistoryModule, EmailEventFeature],
})
export class PublicModule {}
