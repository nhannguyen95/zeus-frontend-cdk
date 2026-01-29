import { Account, BETA_ACCOUNT } from "./accounts";

interface Stage {
    name: string;
    account: Account;
}

enum StageType {
    BETA = 'BETA',
}

const STAGES: Record<StageType, Stage> = {
    [StageType.BETA]: {
        name: 'BETA',
        account: BETA_ACCOUNT,
    },
}
