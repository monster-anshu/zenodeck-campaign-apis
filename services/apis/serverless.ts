import type { AWS } from '@serverless/typescript';
import type { BuildOptions } from 'esbuild';

import * as functions from './functions/index';

const serverlessConfiguration: AWS & { build: { esbuild: BuildOptions } } = {
  service: 'campaign-apis',
  frameworkVersion: '4',
  useDotenv: true,
  plugins: [
    'serverless-deployment-bucket',
    'serverless-prune-plugin',
    'serverless-offline',
    'serverless-offline-sqs',
    'serverless-offline-sns',
  ],
  build: {
    esbuild: {
      external: ['@aws-sdk/*'],
      sourcemap: false,
    },
  },
  custom: {
    prune: {
      automatic: true,
      number: 1,
    },
    'serverless-offline': {
      noPrependStageInUrl: true,
      disableCookieValidation: true,
      httpPort: 3001,
      lambdaPort: 3002,
    },
    'serverless-offline-sqs': {
      autoCreate: true,
      apiVersion: '2012-11-05',
      endpoint: 'http://0.0.0.0:9324',
      region: 'us-east-1',
      skipCacheInvalidation: false,
    },
  },
  provider: {
    name: 'aws',
    runtime: 'nodejs22.x' as never,
    memorySize: 128,
    timeout: 30,
    region: 'us-east-1',
    lambdaHashingVersion: '20201221',
    stage: '${opt:stage}',
    deploymentBucket: {
      name: '${env:SERVERLESS_DEPLOYMENT_BUCKET}',
    },
    logRetentionInDays: 1,
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      // COMMON_QUEUE_URL: '${env:COMMON_QUEUE_URL}',
      // COMMON_FIFO_QUEUE_URL: '${env:COMMON_FIFO_QUEUE_URL}',
      STAGE: '${opt:stage}',
      TZ: 'Asia/Kolkata',
    },
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Resource: '*',
            Action: 'lambda:InvokeFunction',
          },
          {
            Effect: 'Allow',
            Resource: '*',
            Action: 'ses:*',
          },
          {
            Effect: 'Allow',
            Resource: [
              { 'Fn::GetAtt': ['commonQueue', 'Arn'] },
              { 'Fn::GetAtt': ['commonFifoQueue', 'Arn'] },
            ],
            Action: 'sqs:*',
          },
          {
            Effect: 'Allow',
            Resource: '*',
            Action: 'sns:*',
          },
        ],
      },
    },
  },
  package: { individually: true },
  functions: functions,
  resources: {
    Resources: {
      commonQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          VisibilityTimeout: 15 * 60,
          MessageRetentionPeriod: 1209600,
          ReceiveMessageWaitTimeSeconds: 20,
        },
      },
      commonFifoQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          FifoQueue: true,
          VisibilityTimeout: 15 * 60,
          MessageRetentionPeriod: 1209600,
          ReceiveMessageWaitTimeSeconds: 20,
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
