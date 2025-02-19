import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Campaign, CampaignSchemaName } from '~/mongo/campaign';
import { ConnectionName } from '~/mongo/connections';
import { CreateCampaignDto } from './dto/create-campaign.dto';

@Injectable()
export class CampaignService {
  constructor(
    @InjectModel(CampaignSchemaName, ConnectionName.DEFAULT)
    private readonly campaignModel: Model<Campaign>
  ) {}

  async create(
    appId: string,
    userId: string,
    { leadListId, name, time, description }: CreateCampaignDto
  ) {
    const campaign = await this.campaignModel.create({
      appId: appId,
      description: description,
      name: name,
      time: time,
      leadListId: leadListId,
    });

    return campaign;
  }
}
