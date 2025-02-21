import type { SQSHandler } from 'aws-lambda';
import { handlerCampaignShedule } from '~/apis/handler/campaign.handler';
import { handleEmail } from '~/apis/handler/email.handler';

export const handler: SQSHandler = async (event) => {
  const records = event.Records;

  const promises = records.map(async (record) => {
    const message = JSON.parse(record.body);
    if (message.type === 'START_CAMPAIGN') {
      await handlerCampaignShedule(message.campaignId);
    }
    if (message.type === 'SEND_EMAIL') {
      await handleEmail(message);
    }
  });

  await Promise.all(promises);
};
