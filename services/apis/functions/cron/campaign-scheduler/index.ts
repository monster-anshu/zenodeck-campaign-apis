import { handlerPath } from '~/lib/lambda/handler-resolve';

export const campaignShedulerCron = {
  handler: handlerPath(__dirname),
  timeout: 30,
  events: [
    {
      schedule: 'rate(15 minutes)',
    },
  ],
};
