import { Injectable } from '@nestjs/common';
import { encrypt } from '~/lib/crypto';
import { randomString } from '~/lib/random';
import { CampaignAppModel } from '~/mongo/campaign';
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
}
