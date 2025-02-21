import { handlerPath } from '~/lib/lambda/handler-resolve';
import { LambdaFunction } from '~/types';

export const campaignShedulerCron: LambdaFunction = {
  handler: handlerPath(__dirname),
  timeout: 30,
  events: [
    {
      schedule: 'rate(15 minutes)',
    },
  ],
};
