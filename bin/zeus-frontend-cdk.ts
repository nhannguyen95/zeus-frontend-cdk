#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { PipelineStack } from '../lib/stacks/pipeline';
import { BETA_ACCOUNT, DEV_ACCOUNT, PROD_ACCOUNT } from '../lib/constants';

const app = new cdk.App();
new PipelineStack(app, 'PipelineStack', {
  env: {
    account: DEV_ACCOUNT.id,
    region: DEV_ACCOUNT.region,
  },
  // cdk bootstrap aws://${ACCOUNT_ID}/us-west-1 --trust ${DEV_ACCOUNT_ID} --cloudformation-execution-policies arn:aws:iam::aws:policy/AdministratorAccess --force --profile ${PROFILE}
  // ACCOUNT_ID is the ID of the account that hosts the application stacks.
  // DEV_ACCOUNT_ID is the ID of the account that hosts the pipeline.
  stages: [
    {
      name: 'Beta',
      account: BETA_ACCOUNT,
    },
    {
      name: 'Prod',
      account: PROD_ACCOUNT,
    }
  ],
});

app.synth();