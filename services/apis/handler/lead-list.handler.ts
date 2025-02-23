import { FilterQuery, Types } from 'mongoose';
import { generateHTML } from '~/grapejs/generate-html';
import { pushToQueue } from '~/lib/lambda/sqs';
import { Lead, LeadModel } from '~/mongo/campaign';
import { SendMailOptions } from './email.handler';

export type LeadListOptions = {
  leadListId: string;
  appId: string;
  projectData: string;
  from: string;
  subject: string;
  name?: string;
  credential: SendMailOptions['credential'];
  type: 'SEND_TO_LEADS';
};

const LIMIT = 50;

export const handleLeadList = async (
  {
    appId,
    leadListId,
    projectData,
    from,
    subject,
    name,
    credential,
  }: LeadListOptions,
  messageId: string
) => {
  let nextCursor;
  do {
    let filter: FilterQuery<Lead> = {};

    if (nextCursor) {
      filter._id = { $lt: new Types.ObjectId(nextCursor) };
    }

    filter = {
      ...filter,
      appId: appId,
      leadListId: leadListId,
      status: 'ACTIVE',
    };

    const leads = await LeadModel.find(filter)
      .sort({ _id: -1 })
      .limit(LIMIT)
      .lean();

    nextCursor = leads.at(-1)?._id.toString() || null;

    const messages: SendMailOptions[] = leads.map((lead) => {
      const { html, id } = generateHTML(projectData, lead.email);
      return {
        appId: appId,
        credential: credential,
        from: from,
        historyId: id.toString(),
        html: html,
        name: name,
        subject: subject,
        to: lead.email,
        type: 'SEND_EMAIL',
      };
    });

    const promises = messages.map(async (message) => {
      await pushToQueue({ message: message, type: 'COMMON_QUEUE' });
    });

    await Promise.all(promises);
  } while (nextCursor);
};
