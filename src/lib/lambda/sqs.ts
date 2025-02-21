import type { SendMessageCommandInput } from '@aws-sdk/client-sqs';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { COMMON_FIFO_QUEUE_URL, COMMON_QUEUE_URL } from '~/env';

const client = new SQSClient({});

export const QueueTypes = {
  COMMON_QUEUE: {
    url: COMMON_QUEUE_URL,
    isFifoQueue: false,
  },
  COMMON_FIFO_QUEUE: {
    url: COMMON_FIFO_QUEUE_URL,
    isFifoQueue: true,
  },
};

export const pushToQueue = async ({
  message,
  config,
  type = 'COMMON_QUEUE',
}: {
  message: unknown;
  config?: Partial<SendMessageCommandInput>;
  type?: keyof typeof QueueTypes;
}) => {
  const options: SendMessageCommandInput = {
    QueueUrl: QueueTypes[type].url,
    MessageBody: JSON.stringify(message),
  };
  if (QueueTypes[type].isFifoQueue) {
    options.MessageDeduplicationId =
      config?.MessageDeduplicationId || Date.now().toString();
    options.MessageGroupId = config?.MessageGroupId;
  } else {
    if (config?.DelaySeconds && config.DelaySeconds > 0) {
      options.DelaySeconds = config.DelaySeconds;
    }
  }
  const resp = await client.send(new SendMessageCommand(options));
  return {
    MessageId: resp.MessageId,
  };
};
