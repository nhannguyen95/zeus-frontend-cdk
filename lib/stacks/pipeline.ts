import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CodePipeline, ShellStep, CodePipelineSource } from 'aws-cdk-lib/pipelines';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';

export class PipelineStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const buildEnvironment: codebuild.BuildEnvironment = {
            buildImage: codebuild.LinuxBuildImage.STANDARD_7_0,
        };

        const pipeline = new CodePipeline(this, 'Pipeline', {
            pipelineName: 'zeus-frontend-pipeline',
            synth: new ShellStep('Synth', {
                input: CodePipelineSource.connection('nhannguyen95/zeus-frontend-cdk', 'main', {
                    connectionArn: 'arn:aws:codeconnections:us-east-1:533389119429:connection/42d60ce7-88e9-407d-86e4-71714f351907',
                }),
                commands: [
                    'npm install',
                    'npm run build',
                    'npm run cdk synth'
                ]
            }),
            codeBuildDefaults: {
                buildEnvironment,
            },
            synthCodeBuildDefaults: {
                buildEnvironment,
            },
            selfMutationCodeBuildDefaults: {
                buildEnvironment,
            },
        });
    }
}