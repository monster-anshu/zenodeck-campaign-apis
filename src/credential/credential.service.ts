import { Injectable, NotFoundException } from '@nestjs/common';
import { getAppEncryptionKey } from '~/lib/campaign-app';
import { encryptDescryptJsonUsingKeyIv } from '~/lib/crypto/json';
import {
  CampaignAppEncryption,
  Credential,
  CredentialModel,
} from '~/mongo/campaign';
import { AddCredential } from './dto/add-credential.dto';
import { EditCredential } from './dto/edit-credential.dto';

@Injectable()
export class CredentialService {
  static readonly BasicProjection = {
    appId: 1,
    createdAt: 1,
    createdBy: 1,
    name: 1,
    status: 1,
    type: 1,
    updatedAt: 1,
  };

  async list(appId: string) {
    const credentials = await CredentialModel.find(
      {
        appId: appId,
        status: 'ACTIVE',
      },
      CredentialService.BasicProjection
    ).lean();

    return credentials;
  }

  async add(
    appId: string,
    userId: string,
    { privateKeys, type, name }: AddCredential,
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

    credential.privateKeys = encryptDescryptJsonUsingKeyIv(
      privateKeys,
      encryption,
      false
    );

    return credential;
  }

  async edit(
    appId: string,
    userId: string,
    { id, name, privateKeys, type }: EditCredential,
    campaignApp: CampaignAppEncryption
  ) {
    const encryption = await getAppEncryptionKey({ campaignApp });

    const set: Partial<Credential> = {};

    if (name) {
      set.name = name;
    }

    if (type) {
      set.type = type;
    }

    if (privateKeys) {
      set.privateKeys = encryptDescryptJsonUsingKeyIv(privateKeys, encryption);
    }

    const credential = await CredentialModel.findOneAndUpdate(
      {
        appId: appId,
        _id: id,
        status: 'ACTIVE',
      },
      {
        $set: set,
      },
      {
        new: true,
      }
    ).lean();

    if (!credential) {
      return null;
    }

    credential.privateKeys = encryptDescryptJsonUsingKeyIv(
      credential.privateKeys,
      encryption,
      false
    );

    return credential;
  }

  async delete(appId: string, id: string) {
    const credential = await CredentialModel.findOneAndUpdate(
      {
        appId: appId,
        _id: id,
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

  async getById(
    appId: string,
    id: string,
    campaignApp?: CampaignAppEncryption
  ) {
    const projection = campaignApp
      ? { ...CredentialService.BasicProjection, privateKeys: 1 }
      : CredentialService.BasicProjection;

    const credential = await CredentialModel.findOne(
      {
        appId: appId,
        _id: id,
        status: 'ACTIVE',
      },
      projection
    ).lean();

    if (!credential) {
      throw new NotFoundException('CREDENTIAL_NOT_FOUND');
    }

    if (campaignApp) {
      const encryption = await getAppEncryptionKey({ campaignApp });
      credential.privateKeys = encryptDescryptJsonUsingKeyIv(
        credential.privateKeys,
        encryption,
        false
      );
    }

    return credential;
  }
}
