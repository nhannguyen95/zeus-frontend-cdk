export interface Account {
    id: string;
    region: string;
}

enum AccountType {
    DEV = 'DEV',
    BETA = 'BETA',
    PROD = 'PROD',
}

const ACCOUNTS: Record<AccountType, Account> = {
    [AccountType.DEV]: {
        id: '533389119429',
        region: 'us-east-1',
    },
    [AccountType.BETA]: {
        id: '970290367319',
        region: 'us-west-2',
    },
    [AccountType.PROD]: {
        id: '002994899250',
        region: 'us-west-1',
    },
}

export const DEV_ACCOUNT = ACCOUNTS[AccountType.DEV];
export const BETA_ACCOUNT = ACCOUNTS[AccountType.BETA];
export const PROD_ACCOUNT = ACCOUNTS[AccountType.PROD];
