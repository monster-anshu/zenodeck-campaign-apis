import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { FilterQuery, Types } from 'mongoose';
import { ImportLeadDto } from '~/lead-list/dto/import-lead-list.dto';
import { Lead } from '~/mongo/campaign';
import { LeadModelProvider } from '~/mongo/campaign/nest';
import { ListLeadDto } from './dto/list-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';

@Injectable()
export class LeadService {
  constructor(
    @Inject(LeadModelProvider.provide)
    private readonly leadModel: typeof LeadModelProvider.useValue
  ) {}

  async list(
    appId: string,
    leadListId: string,
    { limit, after, q }: ListLeadDto
  ) {
    let filter: FilterQuery<Lead> = {};

    if (after) {
      filter._id = { $lt: new Types.ObjectId(after) };
    }

    filter = {
      ...filter,
      appId: appId,
      leadListId: leadListId,
      status: 'ACTIVE',
    };

    if (q) {
      const escapedQ = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escapes regex special characters
      filter.$or = [
        { firstName: { $regex: escapedQ, $options: 'i' } },
        { lastName: { $regex: escapedQ, $options: 'i' } },
        { email: { $regex: escapedQ, $options: 'i' } },
      ];
    }

    const leads = await this.leadModel
      .find(filter)
      .sort({ _id: -1 })
      .limit(limit)
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
