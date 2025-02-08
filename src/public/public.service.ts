import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HistoryService } from '~/history/history.service';
import {
  EmailEvent,
  EmailLinkClick,
  EmailOpenEvent,
} from '~/mongo/campaign/event.schema';

import { ConnectionName } from '~/mongo/connections';

@Injectable()
export class PublicService {
  constructor(
    private readonly historyService: HistoryService,
    @InjectModel(EmailEvent.OPEN, ConnectionName.DEFAULT)
    private readonly emailOpenModel: Model<EmailOpenEvent>,
    @InjectModel(EmailEvent.CLICK, ConnectionName.DEFAULT)
    private readonly emailClickModel: Model<EmailLinkClick>
  ) {}

  async track(trackId: string) {
    const history = await this.historyService.getById(trackId);

    if (!history) {
      return;
    }

    await this.emailOpenModel.insertMany([
      {
        appId: history.appId,
        count: 1,
        historyId: history._id,
      },
    ]);
  }

  async ctr(trackId: string, url: string) {
    const history = await this.historyService.getById(trackId);

    if (!history) {
      return;
    }

    await this.emailClickModel.insertMany([
      {
        appId: history.appId,
        count: 1,
        historyId: history._id,
        url: url,
      },
    ]);
  }
}
