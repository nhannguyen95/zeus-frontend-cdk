import * as cdk from 'aws-cdk-lib';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { CodePipeline, ShellStep, CodePipelineSource, ManualApprovalStep } from 'aws-cdk-lib/pipelines';
import { aws_codestarconnections as codeconnections } from 'aws-cdk-lib';
import { ApplicationStage } from '../stages/application';

interface PipelineStackProps extends cdk.StackProps {
    betaAccountId: string;
}

export class PipelineStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: PipelineStackProps) {
        super(scope, id, props);

        const githubConnection = new codeconnections.CfnConnection(
            this,
            'GithubConnection',
            {
                connectionName: 'nhannguyen95-github-connection',
                providerType: 'GitHub',
            }
        );

        const betaCloudFormationRole = iam.Role.fromRoleArn(this,
            'BetaCloudFormationRole',
            `arn:aws:iam::${props.betaAccountId}:role/CloudFormationDeploymentRole`, {
            mutable: false
        });

        const betaCrossAccountRole = iam.Role.fromRoleArn(this,
            'BetaCrossAccountRole',
            `arn:aws:iam::${props.betaAccountId}:role/CodePipelineCrossAccountRole`, {
            mutable: false
        });

        const cdkRepo = CodePipelineSource.connection('nhannguyen95/zeus-frontend-cdk', 'main', {
            connectionArn: githubConnection.attrConnectionArn,
        });

        const appRepo = CodePipelineSource.connection('nhannguyen95/zeus-frontend', 'main', {
            connectionArn: githubConnection.attrConnectionArn,
        });

        const key = new kms.Key(this, 'ArtifactKey', {
            alias: 'key/pipeline-artifact-key'
        });

        const artifactBucket = new s3.Bucket(this, 'ArtifactBucket', {
            bucketName: `pipeline-artifact-bucket-${this.account}`,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            encryption: s3.BucketEncryption.KMS,
            encryptionKey: key,
        });

        const pipeline = new CodePipeline(this, 'Pipeline', {
            pipelineName: 'zeus-frontend-pipeline',
            artifactBucket: artifactBucket,
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