import { CampaignOptions } from '~/apis/handler/campaign.handler';
import { pushToQueue } from '~/lib/lambda/sqs';
import { CampaignModel } from '~/mongo/campaign';
import { CAMPAIGN_SCHEDULER_CRON_DURATION } from '../config';

export const handler = async () => {
  const date = new Date();
  date.setMinutes(date.getMinutes() + CAMPAIGN_SCHEDULER_CRON_DURATION);

  const campaigns = await CampaignModel.find({
    queueId: {
      $exists: false,
    },
    status: 'ACTIVE',
    time: {
      $lte: date,
    },
  }).lean();

  const now = new Date();

  const promises = campaigns.map(async (campaign) => {
    const time = new Date(campaign.time);
    const delay = Math.ceil((time.getTime() - now.getTime()) / 1000);

    const message: CampaignOptions = {
      campaignId: campaign._id.toString(),
      type: 'START_CAMPAIGN',
    };

    const result = await pushToQueue({
      message: message,
      config: {
        DelaySeconds: delay < 0 ? 0 : delay,
      },
      type: 'COMMON_QUEUE',
    });

    await CampaignModel.updateOne(
      {
        _id: campaign._id,
      },
      {
        $set: {
          queueId: result.MessageId,
        },
      }
    );
  });

  await Promise.all(promises);
};
