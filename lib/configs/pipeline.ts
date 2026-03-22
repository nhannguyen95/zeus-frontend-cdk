export interface PipelineConfig {
    readonly pipelineName: string;
    readonly awsAccountId: string;
    readonly awsRegionId: string;
}

// cdk bootstrap aws://${ACCOUNT_ID}/us-west-1 --trust ${DEV_ACCOUNT_ID} --cloudformation-execution-policies arn:aws:iam::aws:policy/AdministratorAccess --force --profile ${PROFILE}
// ACCOUNT_ID is the ID of the account that hosts the application stacks.
// DEV_ACCOUNT_ID is the ID of the account that hosts the pipeline.
export const PIPELINE_CONFIG: PipelineConfig = {
    pipelineName: 'zeus-frontend-pipeline',
    awsAccountId: '533389119429',
    awsRegionId: 'us-east-1',
};
