import { Injectable } from '@nestjs/common';
import juice from 'juice';
import { Types } from 'mongoose';
import { SendMailOptions } from '~/apis/handler/email.handler';
import { LeadListOptions } from '~/apis/handler/lead-list.handler';
import { CredentialService } from '~/credential/credential.service';
import { CAMPAIGN_API_URL } from '~/env';
import { generateHTML } from '~/grapejs/generate-html';
import { HistoryService } from '~/history/history.service';
import { LeadService } from '~/lead/lead.service';
import { pushToQueue } from '~/lib/lambda/sqs';
import { CampaignAppEncryption } from '~/mongo/campaign';
import { SendMailDto } from './dto/send-mail.dto';

@Injectable()
export class MailService {
  constructor(
    private readonly credentialService: CredentialService,
    private readonly historyService: HistoryService,
    private readonly leadsService: LeadService
  ) {}

  async send(
    appId: string,
    userId: string,
    {
      credentialId,
      projectData,
      to,
      from,
      subject,
      name,
      leadListId,
    }: SendMailDto,
    campaignApp: CampaignAppEncryption
  ) {
    const credential = await this.credentialService.getById(
      appId,
      credentialId,
      campaignApp
    );

    const credentialToSend = {
      _id: credential._id.toString(),
      privateKeys: credential.privateKeys,
      type: credential.type,
    } as SendMailOptions['credential'];

    if (leadListId) {
      const message: LeadListOptions = {
        appId: appId,
        credential: credentialToSend,
        from: from,
        name: name,
        subject: subject,
        type: 'SEND_TO_LEADS',
        leadListId: leadListId,
        projectData: projectData,
      };

      await pushToQueue({ message: message, type: 'COMMON_QUEUE' });
      return;
    }

    let target: string[] = [];

    if (to) {
      target = Array.isArray(to) ? to : [to];
    }

    const messages: SendMailOptions[] = target.map((to) => {
      const { html, id } = generateHTML(projectData, to);

      return {
        appId: appId,
        credential: credentialToSend,
        from: from,
        historyId: id.toString(),
        html: html,
        name: name,
        subject: subject,
        to: to,
        type: 'SEND_EMAIL',
      };
    });

    const promises = messages.map(async (message) => {
      await pushToQueue({ message: message, type: 'COMMON_QUEUE' });
    });

    await Promise.all(promises);
  }
}
