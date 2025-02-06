import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import dayjs from '~/lib/dayjs';
import { History, HistorySchemaName } from '~/mongo/campaign';
import { ConnectionName } from '~/mongo/connections';

@Injectable()
export class HistoryService {
  constructor(
    @InjectModel(HistorySchemaName, ConnectionName.DEFAULT)
    private readonly historyModel: Model<History>
  ) {}

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
          createdAt: { $gte: start }, // Get emails from the last 7 days
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
    let date = dayjs(start);

    while (date.toDate().valueOf() < end.valueOf()) {
      const formattedDate = date.format('YYYY-MM-DD');
      const currCount = dateMap.get(formattedDate) ?? 0;

      filledStats.push({
        date: formattedDate,
        count: currCount,
      });

      total += currCount;
      date = date.add(1, 'day');
    }

    return { stats: filledStats, total };
  }
}
