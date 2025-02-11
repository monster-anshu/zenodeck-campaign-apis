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

  async insert(
    lead:
      | Omit<Lead, 'updatedAt' | 'createdAt'>
      | Omit<Lead, 'updatedAt' | 'createdAt'>[]
  ) {
    lead = Array.isArray(lead) ? lead : [lead];
    const result = await this.leadModel.insertMany(lead);
    return result;
  }

  async add(leadListId: string, leads: ImportLeadDto['leads']) {
    leads = Array.isArray(leads) ? leads : [leads];

    const bulkOps = leads.map((lead) => ({
      updateOne: {
        filter: {
          email: lead.email,
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
}
