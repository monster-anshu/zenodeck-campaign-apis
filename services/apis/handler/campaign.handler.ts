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
  const campaign = await CampaignModel.findOne({
    _id: campaignId,
    status: 'ACTIVE',
  }).lean();

  if (!campaign) {
    console.error('campaign not found', campaignId);
    return;
  }

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
    leadListId: campaign.leadListId.toString(),
    type: 'SEND_TO_LEADS',
    // need to get
    name: '',
    projectData: '',
    from: '',
    subject: '',
  };

  await pushToQueue({
    message: message,
    type: 'COMMON_QUEUE',
  }).catch((error) => {
    console.error('unable to push to queue', error);
  });
};
