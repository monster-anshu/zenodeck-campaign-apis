import { Types } from 'mongoose';
import {
  CampaignAppEncryption,
  CampaignAppSchema,
  CampaignAppSchemaName,
} from '~/mongo/campaign';
import { MONGO_CONNECTION } from '~/mongo/connections';
import { decrypt } from './crypto';

//TODO: remove this and use DI
export const CampaignAppModel = MONGO_CONNECTION.DEFAULT.model(
  CampaignAppSchemaName,
  CampaignAppSchema
);

type GetAppEncryptionKeyOptions =
  | {
      appId: string | Types.ObjectId;
      campaignApp?: CampaignAppEncryption;
    }
  | {
      campaignApp: CampaignAppEncryption;
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
