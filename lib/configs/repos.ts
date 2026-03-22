export interface Repo {
    readonly name: string;
    readonly branch: string;
}

export const REPOS = {
    cdk: {
        name: 'nhannguyen95/zeus-frontend-cdk',
        branch: 'main',
    },
    app: {
        name: 'nhannguyen95/zeus-frontend',
        branch: 'main',
    }
};
