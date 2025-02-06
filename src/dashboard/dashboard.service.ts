import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CredentialService } from '~/credential/credential.service';
import dayjs from '~/lib/dayjs';
import { EmailHistory, EmailHistorySchemaName } from '~/mongo/campaign';
import { ConnectionName } from '~/mongo/connections';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(EmailHistorySchemaName, ConnectionName.DEFAULT)
    private emailHistoryModel: Model<EmailHistory>,
    private readonly credentialService: CredentialService
  ) {}

  async get(appId: string) {
    const [history, credentialCount] = await Promise.all([
      this.history(appId),
      this.credentialService.count(appId),
    ]);
    return { history, credentialCount };
  }

  async history(appId: string) {
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const last7DaysPromise = this.emailHistoryModel.aggregate<{
      _id: string;
      count: number;
    }>([
      {
        $match: {
          appId: new Types.ObjectId(appId),
          createdAt: { $gte: last7Days }, // Get emails from the last 7 days
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
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 }, // Sort by date
      },
    ]);

    const oneDayMs = 24 * 60 * 60 * 1000;
    const last24Hours = new Date(Date.now() - oneDayMs);

    // Get the last 24 hours' email count
    const last24HoursCountPromise = this.emailHistoryModel.countDocuments({
      appId: new Types.ObjectId(appId),
      createdAt: { $gte: last24Hours },
    });

    const [stats, count] = await Promise.all([
      last7DaysPromise,
      last24HoursCountPromise,
    ]);

    const dateMap = new Map(stats.map(({ _id, count }) => [_id, count]));
    const filledStats: { date: string; count: number }[] = [];

    let date = dayjs();
    for (let i = 0; i < 7; i++) {
      const formattedDate = date.format('YYYY-MM-DD');

      filledStats.push({
        date: formattedDate,
        count: dateMap.get(formattedDate) ?? 0,
      });

      date = date.add(-oneDayMs, 'millisecond');
    }

    return { stats: filledStats, count };
  }
}
