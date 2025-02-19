import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Campaign } from '~/mongo/campaign';

@Injectable()
export class CampaignService {
  constructor(private readonly campaignModel: Model<Campaign>) {}
}
