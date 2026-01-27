import * as cdk from 'aws-cdk-lib';
import * as kms from 'aws-cdk-lib/aws-kms';
import { Construct } from 'constructs';
import { CodePipeline, ShellStep, CodePipelineSource, ManualApprovalStep } from 'aws-cdk-lib/pipelines';
import { aws_codestarconnections as codeconnections } from 'aws-cdk-lib';
import { ApplicationStage } from '../stages/application';

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

        const cdkRepo = CodePipelineSource.connection('nhannguyen95/zeus-frontend-cdk', 'main', {
            connectionArn: githubConnection.attrConnectionArn,
        });

        const appRepo = CodePipelineSource.connection('nhannguyen95/zeus-frontend', 'main', {
            connectionArn: githubConnection.attrConnectionArn,
        });

        const key = new kms.Key(this, 'ArtifactKey', {
            alias: 'key/pipeline-artifact-key'
        });

        const pipeline = new CodePipeline(this, 'Pipeline', {
            pipelineName: 'zeus-frontend-pipeline',
            synth: new ShellStep('Synth', {
                input: cdkRepo,
                additionalInputs: {
                    '../app': appRepo,
                },
                commands: [
                    // TODO: build the appRepo
                    'npm install',
                    'npm run build',
                    'npm run cdk synth'
                ]
            })
        });

        // const betaStage = pipeline.addStage(new ApplicationStage(this, 'Beta', {
        //     websiteAssetPath: '../app/out',  // Path to TanStack Start static export
        //     env: {
        //         account: '970290367319',
        //         region: 'us-west-2',
        //     }
        // }));
        // betaStage.addPost(new ManualApprovalStep('Manual Approval'));
    }
}