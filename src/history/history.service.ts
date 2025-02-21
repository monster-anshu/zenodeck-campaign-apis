import { Inject, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import dayjs from '~/lib/dayjs';
import { History } from '~/mongo/campaign';
import { HistoryModelProvider } from '~/mongo/campaign/nest';

@Injectable()
export class HistoryService {
  constructor(
    @Inject(HistoryModelProvider.provide)
    private readonly historyModel: typeof HistoryModelProvider.useValue
  ) {}

  async getById(historyId: string) {
    const history = await this.historyModel
      .findOne({
        _id: new Types.ObjectId(historyId),
      })
      .lean();

    return history;
  }

  async create(
    history:
      | Omit<History, 'createdAt' | 'updatedAt'>
      | Omit<History, 'createdAt' | 'updatedAt'>[]
  ) {
    const result = await this.historyModel.insertMany(
      Array.isArray(history) ? history : [history]
    );
    return result;
  }

  async stats(appId: string) {
    const start = new Date();
    start.setDate(start.getDate() - 7);
    const end = new Date();

    const result = await this.historyModel.aggregate<{
      _id: string;
      count: number;
    }>([
      {
        $match: {
          appId: new Types.ObjectId(appId),
          createdAt: { $gte: start, $lte: end },
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

    const dateMap = new Map(result.map(({ _id, count }) => [_id, count]));
    const filledStats: { date: string; count: number }[] = [];

    const oneDayMs = 60 * 60 * 24 * 1000;

    let total = 0;
    let date = dayjs(end);

    while (date.toDate().valueOf() > start.valueOf()) {
      const formattedDate = date.format('YYYY-MM-DD');
      const currCount = dateMap.get(formattedDate) ?? 0;

      filledStats.push({
        date: formattedDate,
        count: currCount,
      });

      total += currCount;
      date = date.subtract(oneDayMs, 'millisecond');
    }

    return { stats: filledStats.reverse(), total };
  }
}
