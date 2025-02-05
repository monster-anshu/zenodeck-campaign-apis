import { Injectable } from '@nestjs/common';
import { EmailHistoryModel } from '~/mongo/campaign';

@Injectable()
export class PublicService {
  async track(trackId: string) {
    await EmailHistoryModel.updateOne(
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
