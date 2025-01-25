import { HttpException, Injectable } from '@nestjs/common';
import { CredentialService } from '~/credential/credential.service';
import { CampaignAppEncryption, PrivateKeys } from '~/mongo/campaign';
import { SendMailDto } from './dto/send-mail.dto';

@Injectable()
export class MailService {
  constructor(private readonly credentialService: CredentialService) {}

  async send(
    appId: string,
    userId: string,
    { credentialId, ...body }: SendMailDto,
    campaignApp: CampaignAppEncryption
  ) {
    const credential = await this.credentialService.getById(
      appId,
      credentialId,
      campaignApp
    );

    if (credential.type === 'RESEND_API') {
      return this.resendSend(body, credential.privateKeys);
    }
  }

  async resendSend(
    { body, subject, from, to }: Omit<SendMailDto, 'credentialId'>,
    privateKeys: PrivateKeys
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
        html: body,
      }),
    });

    const json = await res.json();

    if (!res.ok || res.status !== 200) {
      throw new HttpException(json.message || 'SEND_MAIL_FAILED', res.status);
    }

    return true;
  }
}
