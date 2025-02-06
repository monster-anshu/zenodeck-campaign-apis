import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { History, HistorySchemaName } from '~/mongo/campaign';
import { ConnectionName } from '~/mongo/connections';

@Injectable()
export class PublicService {
  constructor(
    @InjectModel(HistorySchemaName, ConnectionName.DEFAULT)
    private readonly historyModel: Model<History>
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
}
