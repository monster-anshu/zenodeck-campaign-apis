import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LeadsListService } from '~/lead-list/lead-list.service';
import { Campaign, CampaignSchemaName } from '~/mongo/campaign';
import { ConnectionName } from '~/mongo/connections';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';

@Injectable()
export class CampaignService {
  constructor(
    private readonly leadListService: LeadsListService,
    @InjectModel(CampaignSchemaName, ConnectionName.DEFAULT)
    private readonly campaignModel: Model<Campaign>
  ) {}

  async getById(appId: string, userId: string, id: string) {
    const campaign = await this.campaignModel
      .findOne({
        appId: appId,
        _id: id,
      })
      .lean();

    if (!campaign) {
      throw new NotFoundException('CAMPAIGN_NOT_FOUND');
    }

    return campaign;
  }

  async create(
    appId: string,
    userId: string,
    { leadListId, name, time, description }: CreateCampaignDto
  ) {
    const leadList = await this.leadListService.getById(appId, leadListId);

    const campaign = await this.campaignModel.create({
      appId: appId,
      description: description,
      leadListId: leadList._id,
      name: name,
      time: time,
    });

    return campaign.toObject();
  }

  async update(
    appId: string,
    userId: string,
    { id, leadListId, ...body }: UpdateCampaignDto
  ) {
    const set: Partial<Campaign> = {};

    Object.assign(set, body);

    if (leadListId) {
      const leadList = await this.leadListService.getById(appId, leadListId);
      set.leadListId = leadList._id;
    }

    const campiagn = await this.campaignModel
      .findOneAndUpdate(
        {
          appId: appId,
          id: id,
        },
        {
          $set: set,
        },
        { new: true }
      )
      .lean();

    if (!campiagn) {
      throw new NotFoundException('CAMPAIGN_NOT_FOUND');
    }

    return campiagn;
  }
}
