import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CodePipeline, ShellStep, CodePipelineSource } from 'aws-cdk-lib/pipelines';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import { aws_codestarconnections as codeconnections } from 'aws-cdk-lib';


export class PipelineStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const githubConnection = new codeconnections.CfnConnection(
            this,
            'GithubConnection',
            {
                connectionName: 'nhannguyen95-github-connection',
                providerType: 'GitHub',
            }
        );

        const pipeline = new CodePipeline(this, 'Pipeline', {
            pipelineName: 'zeus-frontend-pipeline',
            synth: new ShellStep('Synth', {
                input: CodePipelineSource.connection('nhannguyen95/zeus-frontend-cdk', 'main', {
                    connectionArn: githubConnection.attrConnectionArn,
                }),
                commands: [
                    'npm install',
                    'npm run build',
                    'npm run cdk synth'
                ]
            })
        });
    }
}