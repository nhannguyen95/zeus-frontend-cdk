import * as cdk from 'aws-cdk-lib';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import { Construct } from 'constructs';
import { CodePipeline, ShellStep, CodePipelineSource, ManualApprovalStep } from 'aws-cdk-lib/pipelines';
import { aws_codestarconnections as codeconnections } from 'aws-cdk-lib';
import { ApplicationStage } from '../stages/application';
import { Stage } from '../constants';

interface PipelineStackProps extends cdk.StackProps {
    stages: Array<Stage>
}

export class PipelineStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: PipelineStackProps) {
        super(scope, id, props);

        const pipeline = this.createCodePipeline();

        this.createDeploymentStages(pipeline, props.stages);
    }

    createCodePipeline(): CodePipeline {
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

        const pipeline = new CodePipeline(this, 'Pipeline', {
            pipelineName: 'zeus-frontend-pipeline',
            // Encrypt artifacts, required for cross-account deployments
            crossAccountKeys: true,
            enableKeyRotation: true, // optional
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
            }),
            codeBuildDefaults: {
                buildEnvironment: {
                    buildImage: codebuild.LinuxBuildImage.STANDARD_7_0,
                },
            },
        });

        return pipeline;
    }

    createDeploymentStages(pipeline: CodePipeline, stages: Array<Stage>) {
        stages.forEach(stage => {
            const appStage = pipeline.addStage(new ApplicationStage(
                this,
                stage.name,
                {
                    websiteAssetPath: '../app/out',  // Path to NextJS static export
                    stage,
                    env: {
                        account: stage.account.id,
                        region: stage.account.region,
                    }
                }
            ));
            appStage.addPost(new ManualApprovalStep('Manual Approval'));
        });
    }
}