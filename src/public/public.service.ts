import { Inject, Injectable } from '@nestjs/common';
import { HistoryService } from '~/history/history.service';
import {
  EmailLinkClickModelProvider,
  EmailOpenEventModelProvider,
} from '~/mongo/campaign/nest';

@Injectable()
export class PublicService {
  constructor(
    private readonly historyService: HistoryService,
    @Inject(EmailOpenEventModelProvider.provide)
    private readonly emailOpenModel: typeof EmailOpenEventModelProvider.useValue,
    @Inject(EmailLinkClickModelProvider.provide)
    private readonly emailClickModel: typeof EmailLinkClickModelProvider.useValue
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
