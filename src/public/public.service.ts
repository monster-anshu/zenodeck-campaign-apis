import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Ctr,
  CtrSchemaName,
  History,
  HistorySchemaName,
} from '~/mongo/campaign';

import { ConnectionName } from '~/mongo/connections';

@Injectable()
export class PublicService {
  constructor(
    @InjectModel(HistorySchemaName, ConnectionName.DEFAULT)
    private readonly historyModel: Model<History>,
    @InjectModel(CtrSchemaName, ConnectionName.DEFAULT)
    private readonly ctrModel: Model<Ctr>
  ) {}

  async track(trackId: string) {
    await this.historyModel.updateOne(
      {
        _id: trackId,
      },
      {
        $set: {
          lastSeenAt: new Date(),
        },
      }
    );
  }

  async ctr(trackId: string, url: string) {
    const history = await this.historyModel
      .findOne({
        _id: trackId,
      })
      .lean();

    if (!history) {
      return;
    }

    await this.ctrModel.updateOne(
      {
        historyId: history._id,
        url: url,
      },
      {
        $inc: {
          clicks: 1,
        },
        $setOnInsert: {
          historyId: history._id,
          url: url,
        },
      },
      {
        upsert: true,
      }
    );
  }
}
