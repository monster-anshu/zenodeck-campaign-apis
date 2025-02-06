import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EmailHistory, EmailHistorySchemaName } from '~/mongo/campaign';
import { ConnectionName } from '~/mongo/connections';

@Injectable()
export class PublicService {
  constructor(
    @InjectModel(EmailHistorySchemaName, ConnectionName.DEFAULT)
    private emailHistoryModel: Model<EmailHistory>
  ) {}

  async track(trackId: string) {
    await this.emailHistoryModel.updateOne(
      {
        _id: trackId,
        isOpen: { $ne: true },
      },
      {
        $set: {
          isOpen: true,
        },
      }
    );
  }
}
