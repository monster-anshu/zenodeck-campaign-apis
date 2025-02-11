import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { LeadService } from '~/lead/lead.service';
import { LeadList, LeadListName } from '~/mongo/campaign';
import { ConnectionName } from '~/mongo/connections';
import { CreateLeadListDto } from './dto/create-lead-list.dto';
import { ImportLeadDto } from './dto/import-lead-list.dto';
import { UpadteLeadListDto } from './dto/update-lead-list.dto';

@Injectable()
export class LeadsListService {
  constructor(
    private readonly leadService: LeadService,
    @InjectModel(LeadListName, ConnectionName.DEFAULT)
    private readonly leadListModel: Model<LeadList>
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
      await this.leadService.add(appId, leadList._id.toString(), leads);
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

    await this.leadService.add(appId, leadList._id.toString(), leads);
  }

  async remove(appId: string, leadListId: string) {
    const leadList = await this.leadListModel
      .findOneAndUpdate(
        {
          _id: new Types.ObjectId(leadListId),
          appId: appId,
          status: 'ACTIVE',
        },
        {
          $set: {
            status: 'DELETED',
          },
        },
        {
          new: true,
        }
      )
      .lean();

    if (!leadList) {
      throw new NotFoundException('LEAD_LIST_NOT_FOUND');
    }
  }

  async update(appId: string, userId: string, { id, name }: UpadteLeadListDto) {
    const leadList = await this.leadListModel
      .findOneAndUpdate(
        {
          _id: id,
          appId: appId,
          status: 'ACTIVE',
        },
        {
          $set: {
            name,
          },
        },
        {
          new: true,
        }
      )
      .lean();

    if (!leadList) {
      throw new NotFoundException('LEAD_LIST_NOT_FOUND');
    }

    return leadList;
  }
}
