import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { FilterQuery, Types } from 'mongoose';
import { CredentialService } from '~/credential/credential.service';
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
    private readonly credentialService: CredentialService,
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
      .lean()
      .select('-projectData');

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
    {
      leadListId,
      name,
      time,
      description,
      credentialId,
      from,
      projectData,
      subject,
      senderName,
    }: CreateCampaignDto
  ) {
    const [leadList, credential] = await Promise.all([
      this.leadListService.getById(appId, leadListId),
      this.credentialService.getById(appId, credentialId),
    ]);

    const campaign = await this.campaignModel.create({
      appId: appId,
      credentialId: credential._id,
      description: description,
      from: from,
      leadListId: leadList._id,
      name: name,
      projectData: projectData,
      senderName: senderName,
      status: 'ACTIVE',
      subject: subject,
      time: time,
    });

    return campaign.toObject();
  }

  async update(
    appId: string,
    userId: string,
    { id, leadListId, credentialId, ...body }: UpdateCampaignDto
  ) {
    const set: Partial<Campaign> = {};

    Object.assign(set, body);

    if (leadListId || credentialId) {
      const [leadList, credential] = await Promise.all([
        leadListId ? this.leadListService.getById(appId, leadListId) : null,
        credentialId
          ? this.credentialService.getById(appId, credentialId)
          : null,
      ]);

      leadList && (set.leadListId = leadList._id);
      credential && (set.credentialId = credential._id);
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
