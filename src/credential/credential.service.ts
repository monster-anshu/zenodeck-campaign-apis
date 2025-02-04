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

  async list(appId: string, campaignApp?: CampaignAppEncryption | null) {
    const projection = campaignApp
      ? { ...CredentialService.BasicProjection, privateKeys: 1 }
      : CredentialService.BasicProjection;

    const credentials = await CredentialModel.find(
      {
        appId: appId,
        status: 'ACTIVE',
      },
      projection
    ).lean();

    if (campaignApp) {
      const encryption = await getAppEncryptionKey({ campaignApp });
      for (const credential of credentials) {
        credential.privateKeys = encryptDescryptJsonUsingKeyIv(
          credential.privateKeys,
          encryption,
          false
        );
      }
    }

    return credentials;
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

  async add(
    appId: string,
    userId: string,
    { payload, name }: AddCredentialDto,
    campaignApp: CampaignAppEncryption
  ) {
    const { privateKeys, type } = payload;
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
      credential.privateKeys,
      encryption,
      false
    );

    return credential;
  }

  async edit(
    appId: string,
    userId: string,
    { id, name, payload }: EditCredentialDto,
    campaignApp: CampaignAppEncryption
  ) {
    const encryption = await getAppEncryptionKey({ campaignApp });

    const set: Partial<Credential> = {};

    if (name) {
      set.name = name;
    }

    if (payload) {
      set.type = payload.type;
      set.privateKeys = encryptDescryptJsonUsingKeyIv(
        payload.privateKeys,
        encryption
      );
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
}
