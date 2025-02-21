import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { FilterQuery, Types } from 'mongoose';
import { LeadsListService } from '~/lead-list/lead-list.service';
import { Campaign } from '~/mongo/campaign';
import { CampaignModelProvider } from '~/mongo/campaign/nest';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { ListCampaignDto } from './dto/list-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';

@Injectable()
export class CampaignService {
  constructor(
    private readonly leadListService: LeadsListService,
    @Inject(CampaignModelProvider.provide)
    private readonly campaignModel: typeof CampaignModelProvider.useValue
  ) {}

  async list(appId: string, { limit, after, q }: ListCampaignDto) {
    let filter: FilterQuery<Campaign> = {};

    if (after) {
      filter._id = { $lt: new Types.ObjectId(after) };
    }

    filter = {
      ...filter,
      appId: appId,
      status: 'ACTIVE',
    };

    if (q) {
      const escapedQ = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escapes regex special characters
      filter.$or = [
        { name: { $regex: escapedQ, $options: 'i' } },
        { description: { $regex: escapedQ, $options: 'i' } },
      ];
    }

    const campaigns = await this.campaignModel
      .find(filter)
      .sort({ _id: -1 })
      .limit(limit)
      .lean();

    return campaigns;
  }

  async getById(appId: string, id: string) {
    const campaign = await this.campaignModel
      .findOne({
        appId: appId,
        _id: id,
        status: 'ACTIVE',
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
      status: 'ACTIVE',
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

    const campaign = await this.campaignModel
      .findOneAndUpdate(
        {
          appId: appId,
          id: id,
          status: 'ACTIVE',
        },
        {
          $set: set,
        },
        { new: true }
      )
      .lean();

    if (!campaign) {
      throw new NotFoundException('CAMPAIGN_NOT_FOUND');
    }

    return campaign;
  }

  async delete(appId: string, id: string) {
    const campaign = await this.campaignModel
      .findOneAndUpdate(
        {
          appId: appId,
          id: id,
          status: 'ACTIVE',
        },
        {
          $set: {
            status: 'DELETED',
          },
        },
        { new: true }
      )
      .lean();

    if (!campaign) {
      throw new NotFoundException('CAMPAIGN_NOT_FOUND');
    }

    return true;
  }
}
