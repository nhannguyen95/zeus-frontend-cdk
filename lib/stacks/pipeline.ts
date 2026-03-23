import * as cdk from 'aws-cdk-lib';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import { Construct } from 'constructs';
import { CodePipeline, ShellStep, CodePipelineSource, CodeBuildStep } from 'aws-cdk-lib/pipelines';
import { aws_codestarconnections as codeconnections } from 'aws-cdk-lib';
import { Repo, REPOS } from '../configs';

interface PipelineStackProps {
    readonly pipelineName: string;
    readonly awsAccountId: string;
    readonly awsRegionId: string;
}

export class PipelineStack extends cdk.Stack {
    public readonly pipeline: CodePipeline;

    constructor(scope: Construct, id: string, props: PipelineStackProps) {
        super(scope, id, {
            env: {
                account: props.awsAccountId,
                region: props.awsRegionId,
            }
        });

        const githubConnection = this.createGithubConnection();
        const cdkRepo = this.createSourceRepo(githubConnection, REPOS.cdk);
        const appRepo = this.createSourceRepo(githubConnection, REPOS.app);
        this.pipeline = this.createCodePipeline(props.pipelineName, cdkRepo, appRepo);
    }

    createGithubConnection(): codeconnections.CfnConnection {
        return new codeconnections.CfnConnection(
            this,
            'GithubConnection',
            {
                connectionName: 'nhannguyen95-github-connection',
                providerType: 'GitHub',
            }
        );
    }

    createSourceRepo(githubConnection: codeconnections.CfnConnection, repo: Repo): CodePipelineSource {
        return CodePipelineSource.connection(repo.name, repo.branch, {
            connectionArn: githubConnection.attrConnectionArn,
        });
    }

    createCodePipeline(pipelineName: string, cdkRepo: CodePipelineSource, appRepo: CodePipelineSource): CodePipeline {
        const appBuild = new CodeBuildStep('BuildApp', {
            input: appRepo,
            buildEnvironment: {
                buildImage: codebuild.LinuxBuildImage.STANDARD_7_0,
            },
            partialBuildSpec: codebuild.BuildSpec.fromObject({
                phases: {
                    install: {
                        'runtime-versions': {
                            nodejs: '20'
                        }
                    }
                }
            }),
            commands: [
                'npm install',
                'npm run build',
            ],
            primaryOutputDirectory: 'out',  // NextJS's defaut static export folder
        });

        const cdkSynth = new ShellStep('Synth', {
            input: cdkRepo,
            additionalInputs: {
                app: appBuild,
            },
            commands: [
                'npm install',
                'npm run build',
                'npm run cdk synth'
            ]
        });

        const pipeline = new CodePipeline(this, 'Pipeline', {
            pipelineName: pipelineName,
            // Encrypt artifacts, required for cross-account deployments
            crossAccountKeys: true,
            enableKeyRotation: true, // optional
            synth: cdkSynth,
            codeBuildDefaults: {
                buildEnvironment: {
                    buildImage: codebuild.LinuxBuildImage.STANDARD_7_0,
                },
            },
        });
        return pipeline;
    }
}