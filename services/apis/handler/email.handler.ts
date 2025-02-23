import { Types } from 'mongoose';
import { ResendKey, SmtpKey } from '~/credential/dto/add-credential.dto';
import { HistoryModel } from '~/mongo/campaign';
import { TransporterFactory } from '~/transporter/transporter';

export type SendMailOptions = {
  credential: (SmtpKey | ResendKey) & { _id: string };
  historyId: string;
  appId: string;
  from: string;
  html: string;
  name?: string;
  subject: string;
  to: string;
  type: 'SEND_EMAIL';
};

export const handleEmail = async (
  {
    credential,
    from,
    html,
    subject,
    to,
    name,
    appId,
    historyId,
  }: SendMailOptions,
  messageId: string
) => {
  const transporter = TransporterFactory.create(credential);

  if (!transporter) {
    console.error('unable create transporter');
    return;
  }

  try {
    const result = await transporter.send({
      from: from,
      html: html,
      name: name,
      subject: subject,
      to: to,
    });
  } catch (error) {
    console.log('unable to send email', messageId, error);
    return;
  }

  await HistoryModel.insertMany([
    {
      _id: new Types.ObjectId(historyId),
      appId: new Types.ObjectId(appId),
      credentialId: credential._id,
      from: from,
      html: html,
      subject: subject,
      to: to,
    },
  ]);
};
