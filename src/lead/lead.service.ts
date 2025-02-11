import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ImportLeadDto } from '~/lead-list/dto/import-lead-list.dto';
import { Lead, LeadSchemaName } from '~/mongo/campaign';
import { ConnectionName } from '~/mongo/connections';

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
        filter: { email: lead.email, leadListId: leadListId },
        update: { $set: lead },
        upsert: true,
      },
    }));

    await this.leadModel.bulkWrite(bulkOps);
  }
}
