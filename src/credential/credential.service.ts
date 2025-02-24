import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { getAppEncryptionKey } from '~/lib/campaign-app';
import { encryptDescryptJsonUsingKeyIv } from '~/lib/crypto/json';
import { CampaignAppEncryption, Credential } from '~/mongo/campaign';
import {
  CampaignModelProvider,
  CredentialModelProvider,
} from '~/mongo/campaign/nest';
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

  constructor(
    @Inject(CredentialModelProvider.provide)
    private credentialModel: typeof CredentialModelProvider.useValue,
    @Inject(CampaignModelProvider.provide)
    private campaignModel: typeof CampaignModelProvider.useValue
  ) {}

  async list(appId: string, campaignApp?: CampaignAppEncryption | null) {
    const projection = campaignApp
      ? { ...CredentialService.BasicProjection, privateKeys: 1 }
      : CredentialService.BasicProjection;

    const credentials = await this.credentialModel
      .find(
        {
          appId: appId,
          status: 'ACTIVE',
        },
        projection
      )
      .lean();

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

    const credential = await this.credentialModel
      .findOne(
        {
          appId: appId,
          _id: id,
          status: 'ACTIVE',
        },
        projection
      )
      .lean();

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
    const doc = await this.credentialModel.create({
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

    const credential = await this.credentialModel
      .findOneAndUpdate(
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
      )
      .lean();

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
    const campaign = await this.campaignModel
      .findOne({
        appId: appId,
        credentialId: id,
        status: 'ACTIVE',
      })
      .lean();

    if (campaign) {
      throw new BadRequestException('CREDENTIAL_IN_USE');
    }

    const credential = await this.credentialModel
      .findOneAndUpdate(
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
      )
      .lean();

    return credential;
  }

  async count(appId: string) {
    const count = await this.credentialModel.countDocuments({
      appId: appId,
      status: 'ACTIVE',
    });
    return count;
  }
}
