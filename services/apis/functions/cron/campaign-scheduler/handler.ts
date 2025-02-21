import { pushToQueue } from '~/lib/lambda/sqs';
import { CampaignAppModel } from '~/mongo/campaign';

export const handler = async () => {
  const campaigns = await CampaignAppModel.find().lean();

  const promises = campaigns.map(async (campaign) => {
    await pushToQueue({
      message: {
        type: 'START_CAMPAIGN',
        campaignId: campaign._id,
      },
    });
  });

  await Promise.all(promises);
};
