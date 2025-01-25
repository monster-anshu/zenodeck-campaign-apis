import { Types } from 'mongoose';
import { CampaignApp, CampaignAppModel } from '~/mongo/campaign';
import { decrypt } from './crypto';

type GetAppEncryptionKeyOptions =
  | {
      appId: string | Types.ObjectId;
      campaignApp?: CampaignApp;
    }
  | {
      campaignApp: CampaignApp;
      appId?: string | Types.ObjectId;
    };

export type Encryption = {
  key: Buffer;
  iv: Buffer;
};

export const getAppEncryptionKey = async (
  props: GetAppEncryptionKeyOptions
) => {
  let campaignApp = props.campaignApp || null;
  if (!campaignApp && props.appId) {
    campaignApp = await CampaignAppModel.findOne({
      _id: props.appId,
    }).lean();
  }
  if (!campaignApp?.encryption) {
    throw new Error('Encryption not found');
  }
  const { initVector, securitykey } = campaignApp.encryption;
  return {
    key: Buffer.from(decrypt(securitykey)),
    iv: Buffer.from(decrypt(initVector)),
  } as Encryption;
};
