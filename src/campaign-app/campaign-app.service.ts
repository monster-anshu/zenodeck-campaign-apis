import { Injectable } from '@nestjs/common';
import { ProjectionType } from 'mongoose';
import { encrypt } from '~/lib/crypto';
import { randomString } from '~/lib/random';
import { CampaignApp, CampaignAppModel } from '~/mongo/campaign';
import CompanyProductModel from '~/mongo/common/schema/CompanyProduct';

@Injectable()
export class CampaignAppService {
  async createDefault({
    companyId,
    companyName,
  }: {
    companyId: string;
    companyName: string;
  }) {
    const [campaignApp, productInfo] = await Promise.all([
      CampaignAppModel.findOne({
        companyId,
      }).lean(),
      CompanyProductModel.findOne({
        companyId,
        productId: 'CAMPAIGN',
        status: 'ACTIVE',
      }).lean(),
    ]);

    if (campaignApp || !productInfo) {
      return null;
    }

    const company = await CampaignAppModel.create({
      companyId,
      companyProductId: productInfo._id,
      companyName: companyName,
      status: 'ACTIVE',
      encryption: {
        algorithm: encrypt('aes256'),
        initVector: encrypt(randomString(16)),
        securitykey: encrypt(randomString(32)),
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
    let campiagnAppInfo;
    const projection: ProjectionType<CampaignApp> = {
      branding: 1,
      ...additionalProjection,
    };
    if (appId) {
      campiagnAppInfo = await CampaignAppModel.findOne(
        {
          _id: appId,
          companyId,
          status: 'ACTIVE',
        },
        projection
      ).lean();
    }
    if (!campiagnAppInfo) {
      campiagnAppInfo = await CampaignAppModel.findOne(
        {
          companyId,
          status: 'ACTIVE',
        },
        projection
      ).lean();
    }
    return campiagnAppInfo;
  }
}
