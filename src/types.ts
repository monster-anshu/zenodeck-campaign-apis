import { AWS } from '@serverless/typescript';

export type LambdaFunction = NonNullable<AWS['functions']>[string];
