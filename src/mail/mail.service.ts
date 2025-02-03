import { HttpException, Injectable } from '@nestjs/common';
import grapesjs from 'grapesjs';
import juice from 'juice';
import { CredentialService } from '~/credential/credential.service';
import { ResendKey } from '~/credential/dto/add-credential.dto';
import { CampaignAppEncryption } from '~/mongo/campaign';
import { EmailHistoryModel } from '~/mongo/campaign/history.schema';
import { SendMailDto } from './dto/send-mail.dto';

@Injectable()
export class MailService {
  constructor(private readonly credentialService: CredentialService) {}

  async send(
    appId: string,
    userId: string,
    { credentialId, projectData, ...body }: SendMailDto,
    campaignApp: CampaignAppEncryption
  ) {
    const credential = await this.credentialService.getById(
      appId,
      credentialId,
      campaignApp
    );

    const html = this.generateHTML(projectData);

    const payload = { ...body, html };

    if (credential.type === 'RESEND_API') {
      await this.resendSend(payload, credential.privateKeys as never);
    }

    await EmailHistoryModel.create({
      agentId: userId,
      appId: appId,
      html: html,
      subject: body.subject,
    });
  }

  async resendSend(
    {
      html,
      subject,
      from,
      to,
    }: Omit<SendMailDto, 'credentialId' | 'projectData'> & { html: string },
    privateKeys: ResendKey['privateKeys']
  ) {
    const apiKey = privateKeys.apiKey;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: from,
        to: Array.isArray(to) ? to : [to],
        subject: subject,
        html: html,
      }),
    });

    const json = await res.json();

    if (!res.ok || res.status !== 200) {
      throw new HttpException(json.message || 'SEND_MAIL_FAILED', res.status);
    }

    return true;
  }

  generateHTML(projectData: string | object) {
    const prasedData =
      typeof projectData === 'string' ? JSON.parse(projectData) : projectData;

    const editor = grapesjs.init({
      headless: true,
      projectData: prasedData,
    });

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
                ${editor.getHtml()}
              </body>
            </html>`;

    html = juice(html);

    return html;
  }
}
