#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { PipelineStack } from '../lib/stacks/pipeline';
import { PIPELINE_CONFIG } from '../lib/configs/pipeline';
import { StageConfig, STAGES_CONFIG } from '../lib/configs';
import { ApplicationStage } from '../lib/stages/application';
import { ManualApprovalStep } from 'aws-cdk-lib/pipelines';

const app = new cdk.App();

const pipelineStack = createPipelineStack(app);

STAGES_CONFIG.map((stageConfig) => createStage(pipelineStack, stageConfig));

app.synth();

function createPipelineStack(app: cdk.App): PipelineStack {
    return new PipelineStack(app, 'PipelineStack', { ...PIPELINE_CONFIG });
}

function createStage(pipelineStack: PipelineStack, stageConfig: StageConfig) {
    const pipeline = pipelineStack.pipeline;
    const stage = pipeline.addStage(new ApplicationStage(
        pipelineStack,
        stageConfig.stageName,
        {
            awsAccountId: stageConfig.awsAccountId,
            awsRegionId: stageConfig.awsRegionId,
        }
    ));
    stage.addPost(new ManualApprovalStep('Manual Approval'));
}