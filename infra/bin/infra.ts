#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { DbStack } from '../lib/db-stack';
import { EcsStack } from '../lib/ecs-stack';

const app = new cdk.App();

const dbStack = new DbStack(app, 'UserApiDbStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION }
});

new EcsStack(app, 'UserApiEcsStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
  dbStack,
});
