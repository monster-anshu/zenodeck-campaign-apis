import { pushToQueue } from '~/lib/lambda/sqs';
import { CampaignModel, CredentialModel } from '~/mongo/campaign';
import { SendMailOptions } from './email.handler';
import { LeadListOptions } from './lead-list.handler';

export type CampaignOptions = {
  type: 'START_CAMPAIGN';
  campaignId: string;
};

export const handlerCampaignShedule = async (
  { campaignId }: CampaignOptions,
  messageId: string
) => {
  console.info('fetching campaign', campaignId);

  const campaign = await CampaignModel.findOne({
    _id: campaignId,
    status: 'ACTIVE',
  }).lean();

  if (!campaign) {
    console.error('campaign not found', campaignId);
    return;
  }

  console.info('fetching credential', campaign.credentialId);
  const credential = await CredentialModel.findOne({
    _id: campaign.credentialId,
    appId: campaign.appId,
    status: 'ACTIVE',
  }).lean();

  if (!credential) {
    console.error('credential not found', campaign.credentialId);
    return;
  }

  const credentialToSend = {
    _id: credential._id.toString(),
    privateKeys: credential.privateKeys,
    type: credential.type,
  } as SendMailOptions['credential'];

  const message: LeadListOptions = {
    appId: campaign.appId.toString(),
    credential: credentialToSend,
    from: campaign.from,
    leadListId: campaign.leadListId.toString(),
    name: campaign.senderName || undefined,
    projectData: campaign.projectData,
    subject: campaign.subject,
    type: 'SEND_TO_LEADS',
  };

  console.info('pushing to lead list queue', campaign.credentialId);
  await pushToQueue({
    message: message,
    type: 'COMMON_QUEUE',
  }).catch((error) => {
    console.error('unable to push to queue', error);
  });
};
