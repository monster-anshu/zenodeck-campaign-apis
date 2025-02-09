import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CampaignAppService } from '~/campaign-app/campaign-app.service';
import { CredentialService } from '~/credential/credential.service';
import { HistoryService } from '~/history/history.service';
import dayjs from '~/lib/dayjs';
import { EmailEvent, EmailLinkClick, EmailOpenEvent } from '~/mongo/campaign';
import { ConnectionName } from '~/mongo/connections';

@Injectable()
export class DashboardService {
  constructor(
    private readonly historyService: HistoryService,
    private readonly credentialService: CredentialService,
    private readonly campaignAppService: CampaignAppService,
    @InjectModel(EmailEvent.OPEN, ConnectionName.DEFAULT)
    private readonly emailOpenModel: Model<EmailOpenEvent>,
    @InjectModel(EmailEvent.CLICK, ConnectionName.DEFAULT)
    private readonly emailClickModel: Model<EmailLinkClick>
  ) {}

  async get(appId: string) {
    const [history, credentialCount, campaignApp, ctr, openedMail] =
      await Promise.all([
        this.historyService.stats(appId),
        this.credentialService.count(appId),
        this.campaignAppService.getById(appId),
        this.getCtr(appId),
        this.getOpened(appId),
      ]);

    return {
      history,
      ctr,
      openedMail,
      credential: {
        total: credentialCount,
      },
      appInfo: {
        storageUsed: campaignApp?.storageUsed,
      },
    };
  }

  async getCtr(appId: string) {
    const start = new Date();
    start.setDate(start.getDate() - 7);
    const end = new Date();

    const result = await this.emailClickModel.aggregate<{
      _id: string;
      count: number;
    }>([
      {
        $match: {
          appId: new Types.ObjectId(appId),
          createdAt: {
            $gte: start,
            $lte: end,
          },
        },
      },
      {
        $addFields: {
          date: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
        },
      },
      {
        $group: {
          _id: '$date',
          count: { $sum: '$count' },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const dateMap = new Map(result.map(({ _id, count }) => [_id, count]));
    const filledStats: { date: string; count: number }[] = [];

    const oneDayMs = 60 * 60 * 24 * 1000;

    let total = 0;
    let date = dayjs(start);

    while (date.toDate().valueOf() < end.valueOf()) {
      const formattedDate = date.format('YYYY-MM-DD');
      const currCount = dateMap.get(formattedDate) ?? 0;

      filledStats.push({
        date: formattedDate,
        count: currCount,
      });

      total += currCount;
      date = date.add(oneDayMs, 'millisecond');
    }

    return { stats: filledStats, total };
  }

  async getOpened(appId: string) {
    const start = new Date();
    start.setDate(start.getDate() - 7);
    const end = new Date();

    const result = await this.emailOpenModel.aggregate<{
      _id: string;
      count: number;
    }>([
      {
        $match: {
          appId: new Types.ObjectId(appId),
          createdAt: {
            $gte: start,
            $lte: end,
          },
        },
      },
      {
        $addFields: {
          date: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
        },
      },
      {
        $group: {
          _id: '$date',
          count: { $sum: '$count' },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const dateMap = new Map(result.map(({ _id, count }) => [_id, count]));
    const filledStats: { date: string; count: number }[] = [];

    const oneDayMs = 60 * 60 * 24 * 1000;

    let total = 0;
    let date = dayjs(start);

    while (date.toDate().valueOf() < end.valueOf()) {
      const formattedDate = date.format('YYYY-MM-DD');
      const currCount = dateMap.get(formattedDate) ?? 0;

      filledStats.push({
        date: formattedDate,
        count: currCount,
      });

      total += currCount;
      date = date.add(oneDayMs, 'millisecond');
    }

    return { stats: filledStats, total };
  }
}
