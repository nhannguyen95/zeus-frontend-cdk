#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { PipelineStack } from '../lib/stacks/pipeline';
import { BETA_ACCOUNT, DEV_ACCOUNT } from '../lib/constants';

const app = new cdk.App();
new PipelineStack(app, 'PipelineStack', {
  env: {
    account: DEV_ACCOUNT.id,
    region: DEV_ACCOUNT.region,
  },
  stages: [
    {
      name: 'Beta',
      account: BETA_ACCOUNT,
    },
  ],
});

app.synth();