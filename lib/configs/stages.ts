export interface StageConfig {
    readonly stageName: string;
    readonly awsAccountId: string;
    readonly awsRegionId: string;
}

export const STAGES_CONFIG: StageConfig[] = [
    {
        stageName: 'Beta',
        awsAccountId: '970290367319',
        awsRegionId: 'us-west-2',
    },
    {
        stageName: 'Prod',
        awsAccountId: '002994899250',
        awsRegionId: 'us-west-1',
    },
];
