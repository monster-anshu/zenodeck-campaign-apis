import { handlerPath } from '~/lib/lambda/handler-resolve';
import { LambdaFunction } from '~/types';

export const campaignQueue: LambdaFunction = {
  handler: handlerPath(__dirname),
  timeout: 30,
  events: [
    {
      sqs: {
        arn: { 'Fn::GetAtt': ['commonQueue', 'Arn'] },
      },
    },
  ],
};
