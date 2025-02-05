import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import grapesjs from 'grapesjs';
import juice from 'juice';
import { Model, Types } from 'mongoose';
import { CredentialService } from '~/credential/credential.service';
import { CAMPAIGN_API_URL } from '~/env';
import {
  CampaignAppEncryption,
  EmailHistory,
  EmailHistorySchemaName,
} from '~/mongo/campaign';
import { ConnectionName } from '~/mongo/connections';
import { TransporterFactory } from '~/transporter/transporter';
import { SendMailDto } from './dto/send-mail.dto';

@Injectable()
export class MailService {
  constructor(
    private readonly credentialService: CredentialService,
    @InjectModel(EmailHistorySchemaName, ConnectionName.DEFAULT)
    private emailHistoryModel: Model<EmailHistory>
  ) {}

  async send(
    appId: string,
    agen: string,
    { credentialId, projectData, to, from, subject, name }: SendMailDto,
    campaignApp: CampaignAppEncryption
  ) {
    const credential = await this.credentialService.getById(
      appId,
      credentialId,
      campaignApp
    );

    const transporter = TransporterFactory.create({
      privateKeys: credential.privateKeys as never,
      type: credential.type,
    });

    if (!transporter) {
      throw new BadRequestException('UNABLE_TO_CREATE_TRANSPORTER');
    }

    const payloadWithHtml = (Array.isArray(to) ? to : [to]).map((to) => {
      const { html, id } = this.generateHTML(projectData, to);

      return { html, to, id };
    });

    const emailHistory: Partial<EmailHistory & { _id: Types.ObjectId }>[] = [];

    const promises = payloadWithHtml.map(async ({ html, to, id }) => {
      await transporter.send({
        from: from,
        html: html,
        subject: subject,
        to: to,
        name: name,
      });

      emailHistory.push({
        appId: new Types.ObjectId(appId),
        credentialId: credential._id,
        from: from,
        html: html,
        subject: subject,
        to: to,
        agentId: new Types.ObjectId(agen),
        _id: id,
      });
    });

    await Promise.all(promises);

    await this.emailHistoryModel.insertMany(emailHistory);
  }

  private generateHTML(projectData: string | object, to: string) {
    const prasedData =
      typeof projectData === 'string' ? JSON.parse(projectData) : projectData;

    const editor = grapesjs.init({
      headless: true,
      projectData: prasedData,
    });

    const id = new Types.ObjectId();

    const trackingUrl = new URL(
      CAMPAIGN_API_URL + '/api/v1/campaign/public/track'
    );

    trackingUrl.searchParams.append('email', to);
    trackingUrl.searchParams.append('timestamp', Date.now() + '');
    trackingUrl.searchParams.append('trackId', id.toString());

    let html = `<!DOCTYPE html>
            <html lang="en">
              <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <style>
                  ${editor.getCss()}
                </style>
              </head>
              <body>
                <!-- Tracking Pixel -->
                <img src="${trackingUrl}" width="1" height="1" style="display:none;" />
                ${editor.getHtml()}
              </body>
            </html>`;

    html = juice(html);

    return { html, id };
  }
}
