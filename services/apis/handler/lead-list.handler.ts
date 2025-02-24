import { FilterQuery, Types } from 'mongoose';
import pLimit from 'p-limit';
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

const LIMIT = 500;
const CONCURRENCY_LIMIT = 200;

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
  let nextCursor: string | null = null;
  const limit = pLimit(CONCURRENCY_LIMIT);

  do {
    const filter: FilterQuery<Lead> = {
      ...(nextCursor && { _id: { $lt: new Types.ObjectId(nextCursor) } }),
      appId,
      leadListId,
      status: 'ACTIVE',
    };

    const leads = await LeadModel.find(filter, { _id: 1, email: 1 })
      .sort({ _id: -1 })
      .limit(LIMIT)
      .lean()
      .catch((error) => {
        console.error('unable to fetch leads', error);
        return [];
      });

    if (leads.length === 0) break;

    nextCursor = leads[leads.length - 1]._id.toString();

    const promises = leads.map((lead) =>
      limit(() => {
        const { html, id } = generateHTML(projectData, lead.email);
        return pushToQueue({
          message: {
            appId,
            credential,
            from,
            historyId: id.toString(),
            html,
            name,
            subject,
            to: lead.email,
            type: 'SEND_EMAIL',
          },
          type: 'COMMON_QUEUE',
        }).catch((error) => {
          console.error('unable to push to queue', error);
        });
      })
    );

    await Promise.all(promises);
  } while (nextCursor);
};
