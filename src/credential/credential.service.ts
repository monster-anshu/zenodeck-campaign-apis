import { Injectable } from '@nestjs/common';
import { getAppEncryptionKey } from '~/lib/campaign-app';
import { encryptDescryptJsonUsingKeyIv } from '~/lib/crypto/json';
import {
  CampaignAppEncryption,
  Credential,
  CredentialModel,
} from '~/mongo/campaign';
import { AddCredentialDto } from './dto/add-credential.dto';
import { EditCredentialDto } from './dto/edit-credential.dto';

@Injectable()
export class CredentialService {
  async list(appId: string) {
    const credentials = await CredentialModel.find(
      {
        appId: appId,
        status: 'ACTIVE',
      },
      {
        appId: 1,
        createdAt: 1,
        createdBy: 1,
        name: 1,
        status: 1,
        type: 1,
        updatedAt: 1,
      }
    ).lean();

    return credentials;
  }

  async add(
    appId: string,
    userId: string,
    { privateKeys, type, name }: AddCredentialDto,
    campaignApp: CampaignAppEncryption
  ) {
    const encryption = await getAppEncryptionKey({ campaignApp });
    const doc = await CredentialModel.create({
      appId: appId,
      createdBy: userId,
      name: name,
      privateKeys: encryptDescryptJsonUsingKeyIv(privateKeys, encryption),
      type: type,
    });
    const credential = doc.toObject();
    delete credential.privateKeys;
    return credential;
  }

  async edit(
    appId: string,
    userId: string,
    { id, name, privateKeys, type }: EditCredentialDto,
    campaignApp: CampaignAppEncryption
  ) {
    const set: Partial<Credential> = {};

    if (name) {
      set.name = name;
    }

    if (privateKeys) {
      const encryption = await getAppEncryptionKey({ campaignApp });
      set.privateKeys = encryptDescryptJsonUsingKeyIv(privateKeys, encryption);
    }

    if (type) {
      set.type = type;
    }

    const credential = await CredentialModel.findOneAndUpdate(
      {
        appId: appId,
        id: id,
        status: 'ACTIVE',
      },
      {
        $set: set,
      },
      {
        new: true,
      }
    )
      .select('-privateKeys')
      .lean();

    return credential;
  }

  async delete(appId: string, id: string) {
    const credential = await CredentialModel.findOneAndUpdate(
      {
        appId: appId,
        id: id,
        status: 'ACTIVE',
      },
      {
        $set: {
          status: 'DELETED',
        },
      }
    ).lean();

    return credential;
  }
}
