import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ImportLeadDto } from '~/lead-list/dto/import-lead-list.dto';
import { Lead, LeadSchemaName } from '~/mongo/campaign';
import { ConnectionName } from '~/mongo/connections';
import { UpdateLeadDto } from './dto/update-lead.dto';

@Injectable()
export class LeadService {
  constructor(
    @InjectModel(LeadSchemaName, ConnectionName.DEFAULT)
    private readonly leadModel: Model<Lead>
  ) {}

  async list(appId: string, leadListId: string) {
    const leads = await this.leadModel
      .find({
        appId: appId,
        leadListId: leadListId,
        status: 'ACTIVE',
      })
      .lean();

    return leads;
  }

  async add(appId: string, leadListId: string, leads: ImportLeadDto['leads']) {
    leads = Array.isArray(leads) ? leads : [leads];

    const bulkOps = leads.map((lead) => ({
      updateOne: {
        filter: {
          email: lead.email,
          appId: appId,
          leadListId: leadListId,
          status: 'ACTIVE',
        },
        update: { $set: lead },
        upsert: true,
      },
    }));

    await this.leadModel.bulkWrite(bulkOps);
  }

  async update(appId: string, { id, firstName, lastName }: UpdateLeadDto) {
    const lead = await this.leadModel
      .findOneAndUpdate(
        {
          _id: id,
          appId: appId,
          status: 'ACTIVE',
        },
        {
          $set: {
            firstName,
            lastName,
          },
        },
        {
          new: true,
        }
      )
      .lean();

    if (!lead) {
      throw new NotFoundException('LEAD_NOT_FOUND');
    }

    return lead;
  }

  async remove(appId: string, id: string) {
    const lead = await this.leadModel
      .findOneAndUpdate(
        {
          _id: id,
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

    if (!lead) {
      throw new NotFoundException('LEAD_NOT_FOUND');
    }

    return lead;
  }
}
