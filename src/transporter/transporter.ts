import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { ResendKey, SmtpKey } from '~/credential/dto/add-credential.dto';

type SendOption = {
  from: string;
  to: string;
  html: string;
  subject: string;
  name?: string;
};

interface EmailTransporter {
  send(options: SendOption): Promise<void>;
}

class NodeMailerTransporter implements EmailTransporter {
  constructor(
    private readonly transporter: nodemailer.Transporter<
      SMTPTransport.SentMessageInfo,
      SMTPTransport.Options
    >
  ) {}

  async send({ from, html, subject, to, name }: SendOption) {
    const fromAddress = name ? { name, address: from } : from;

    const res = await this.transporter.sendMail({
      from: fromAddress,
      to: to,
      subject: subject,
      html: html,
    });

    res.messageId;
  }
}

class ResendTransporter implements EmailTransporter {
  constructor(private readonly apiKey: string) {}

  async send({ from, html, subject, to, name }: SendOption) {
    const fromAddress = name ? `${name} <${from}>` : from;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        from: fromAddress,
        to: Array.isArray(to) ? to : [to],
        subject: subject,
        html: html,
      }),
    });

    const json = await res.json();

    return json.id;
  }
}

export class TransporterFactory {
  static create(credential: SmtpKey | ResendKey) {
    if (credential.type === 'RESEND_API') {
      const { apiKey } = credential.privateKeys;
      return new ResendTransporter(apiKey);
    }

    if (credential.type === 'SMTP') {
      const { host, password, port, username } = credential.privateKeys;
      const transport = nodemailer.createTransport({
        host: host,
        port: port,
        secure: false, // true for port 465, false for other ports
        auth: {
          user: username,
          pass: password,
        },
      });

      return new NodeMailerTransporter(transport);
    }
  }
}
