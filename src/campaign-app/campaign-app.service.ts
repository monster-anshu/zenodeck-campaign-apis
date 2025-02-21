import { Inject, Injectable } from '@nestjs/common';
import { ProjectionType, Types } from 'mongoose';
import { encrypt } from '~/lib/crypto';
import { randomString } from '~/lib/random';
import { CampaignApp } from '~/mongo/campaign';
import { CampaignAppModelProvider } from '~/mongo/campaign/nest';
import CompanyProductModel from '~/mongo/common/schema/CompanyProduct';

@Injectable()
export class CampaignAppService {
  constructor(
    @Inject(CampaignAppModelProvider.provide)
    private campaignAppModel: typeof CampaignAppModelProvider.useValue
  ) {}

  async createDefault({
    companyId,
    companyName,
  }: {
    companyId: string;
    companyName: string;
  }) {
    const [campaignApp, productInfo] = await Promise.all([
      this.campaignAppModel
        .findOne({
          companyId,
        })
        .lean(),
      CompanyProductModel.findOne({
        companyId,
        productId: 'CAMPAIGN',
        status: 'ACTIVE',
      }).lean(),
    ]);

    if (campaignApp || !productInfo) {
      return null;
    }

    const company = await this.campaignAppModel.create({
      companyId,
      companyProductId: productInfo._id,
      status: 'ACTIVE',
      encryption: {
        algorithm: encrypt('aes256'),
        initVector: encrypt(randomString(16)),
        securitykey: encrypt(randomString(32)),
      },
      branding: {
        name: companyName,
      },
    });

    return company;
  }

  async get({
    appId,
    companyId,
    projection: additionalProjection,
  }: {
    appId?: string;
    companyId: string;
    projection?: Record<string, number>;
  }) {
    let campaignAppInfo;
    const projection: ProjectionType<CampaignApp> = {
      branding: 1,
      ...additionalProjection,
    };
    if (appId) {
      campaignAppInfo = await this.campaignAppModel
        .findOne(
          {
            _id: appId,
            companyId,
            status: 'ACTIVE',
          },
          projection
        )
        .lean();
    }
    if (!campaignAppInfo) {
      campaignAppInfo = await this.campaignAppModel
        .findOne(
          {
            companyId,
            status: 'ACTIVE',
          },
          projection
        )
        .lean();
    }
    return campaignAppInfo;
  }

  async getById(appId: string) {
    const campaignApp = await this.campaignAppModel
      .findOne({
        _id: appId,
        status: 'ACTIVE',
      })
      .lean();

    return campaignApp;
  }
}
