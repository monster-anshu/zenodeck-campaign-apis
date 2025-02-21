import {
  InvocationType,
  InvokeCommand,
  LambdaClient,
} from '@aws-sdk/client-lambda';
import { fromUtf8, toUtf8 } from '@aws-sdk/util-utf8-node';
import { AWS_REGION, IS_OFFLINE, NODE_ENV, STAGE } from '~/env';

const moduleToPort = {};

interface LambdaDef {
  functionName: string;
  module?: keyof typeof moduleToPort;
}

const LambdaFunctions: Record<string, LambdaDef> = {
  inviteUserToCompany: {
    functionName: 'zenodeck-user-service-' + STAGE + '-inviteUserToCompany',
  },
  resendInviteToCompany: {
    functionName: 'zenodeck-user-service-' + STAGE + '-resendInviteToCompany',
  },
  deleteInvitation: {
    functionName: 'zenodeck-user-service-' + STAGE + '-deleteInvitation',
  },
};

const DEFAULT_OFFLINE_PORT = 3002;
export const invokeLambda = async ({
  data,
  functionName,
  invocationType = 'RequestResponse',
}: {
  data: Record<any, any>;
  functionName: keyof typeof LambdaFunctions;
  invocationType?: InvocationType;
}): Promise<any> => {
  const LambdaFunction = LambdaFunctions[functionName];
  if (!LambdaFunction) {
    throw new Error(`Lambda function '${functionName}' not found.`);
  }
  const lambdaOptions: any = {
    apiVersion: '2015-03-31',
    region: AWS_REGION,
  };
  if (IS_OFFLINE) {
    const offlinePort = LambdaFunction.module
      ? moduleToPort[LambdaFunction.module]
      : DEFAULT_OFFLINE_PORT || DEFAULT_OFFLINE_PORT;
    lambdaOptions.endpoint = 'http://localhost:' + offlinePort;
  }
  const client = new LambdaClient(lambdaOptions);
  const input = {
    FunctionName: LambdaFunction.functionName,
    InvocationType: invocationType,
    Payload: fromUtf8(JSON.stringify(data)),
  };

  const command = new InvokeCommand(input);

  const resp = await client.send(command);

  let dataPayload = null;
  if (resp.Payload) {
    const data = toUtf8(resp.Payload);
    if (data) {
      dataPayload = JSON.parse(data);
    }
  }

  if (resp.FunctionError) {
    throw dataPayload;
  }

  return dataPayload;
};
