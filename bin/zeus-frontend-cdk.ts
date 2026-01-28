#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { PipelineStack } from '../lib/stacks/pipeline';

const app = new cdk.App();
new PipelineStack(app, 'PipelineStack', {
  env: {
    account: '533389119429',
    region: 'us-east-1',
  }
});

app.synth();