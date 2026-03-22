import { DistributionStack } from '../stacks/distribution';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

interface ApplicationStageProps {
    readonly websiteAssetPath: string;
    readonly awsAccountId: string;
    readonly awsRegionId: string;
}

export class ApplicationStage extends cdk.Stage {
    constructor(scope: Construct, id: string, props: ApplicationStageProps) {
        super(scope, id, {
            env: {
                account: props.awsAccountId,
                region: props.awsRegionId,
            }
        });

        new DistributionStack(this, `DistributionStack`, {
            websiteAssetPath: props.websiteAssetPath,
        });
    }
}