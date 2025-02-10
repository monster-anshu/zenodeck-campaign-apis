import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Lead, LeadList, LeadListName, LeadSchemaName } from '~/mongo/campaign';
import { ConnectionName } from '~/mongo/connections';
import { CreateLeadListDto } from './dto/create-lead-list.dto';
import { ImportLeadDto } from './dto/import-lead-list.dto';

@Injectable()
export class LeadsListService {
  constructor(
    @InjectModel(LeadListName, ConnectionName.DEFAULT)
    private readonly leadListModel: Model<LeadList>,
    @InjectModel(LeadSchemaName, ConnectionName.DEFAULT)
    private readonly leadModel: Model<Lead>
  ) {}

  async list(appId: string) {
    const leadLists = await this.leadListModel
      .find({
        appId: appId,
        status: 'ACTIVE',
      })
      .lean();

    return leadLists;
  }

  async create(
    appId: string,
    userId: string,
    { name, leads }: CreateLeadListDto
  ) {
    const leadList = new this.leadListModel({
      appId: appId,
      name: name,
      status: 'ACTIVE',
    });

    await leadList.save();

    if (leads.length) {
      await this.leadModel.insertMany(
        leads.map((lead) => {
          return {
            ...lead,
            appId: appId,
            status: 'ACTIVE',
            leadListId: leadList._id,
          };
        })
      );
    }

    return leadList.toObject();
  }

  async import(
    appId: string,
    userId: string,
    { leadListId, leads }: ImportLeadDto
  ) {
    const leadList = await this.leadListModel
      .findOne({
        appId: appId,
        _id: leadListId,
        status: 'ACTIVE',
      })
      .lean();

    if (!leadList) {
      throw new NotFoundException('LEAD_LIST_NOT_FOUND');
    }

    const bulkOps = leads.map((lead) => ({
      updateOne: {
        filter: { email: lead.email },
        update: { $set: lead },
        upsert: true,
      },
    }));

    await this.leadModel.bulkWrite(bulkOps);
  }
}
