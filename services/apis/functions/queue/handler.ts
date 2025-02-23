import type { SQSHandler } from 'aws-lambda';
import { handlerCampaignShedule } from '~/apis/handler/campaign.handler';
import { handleEmail } from '~/apis/handler/email.handler';
import { handleLeadList } from '~/apis/handler/lead-list.handler';

export const handler: SQSHandler = async (event) => {
  const records = event.Records;

  const promises = records.map(async (record) => {
    const message = JSON.parse(record.body);
    if (message.type === 'START_CAMPAIGN') {
      await handlerCampaignShedule(message.campaignId, record.messageId);
    }
    if (message.type === 'SEND_EMAIL') {
      await handleEmail(message, record.messageId);
    }
    if (message.type === 'LEAD_LIST') {
      await handleLeadList(message, record.messageId);
    }
  });

  await Promise.all(promises);
};
