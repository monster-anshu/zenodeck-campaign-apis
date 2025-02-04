import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import dayjs from '~/lib/dayjs';
import { EmailHistoryModel } from '~/mongo/campaign';

@Injectable()
export class DashboardService {
  async get(appId: string) {
    const [history] = await Promise.all([this.history(appId)]);
    return { history };
  }

  async history(appId: string) {
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const last7DaysPromise = EmailHistoryModel.aggregate<{
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
    const last24HoursCountPromise = EmailHistoryModel.countDocuments({
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
