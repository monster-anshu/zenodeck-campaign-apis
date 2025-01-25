import { Injectable, NotFoundException } from '@nestjs/common';
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
    const credential = doc.toObject() as Partial<Credential>;
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
