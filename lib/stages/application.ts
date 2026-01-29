import { DistributionStack } from '../stacks/distribution';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Stage } from '../constants';

interface ApplicationStageProps extends cdk.StageProps {
    websiteAssetPath: string;
    stage: Stage;
}

export class ApplicationStage extends cdk.Stage {
    constructor(scope: Construct, id: string, props: ApplicationStageProps) {
        super(scope, id, props);

        new DistributionStack(this, `DistributionStack`, {
            websiteAssetPath: props.websiteAssetPath,
        });
    }
}