export type AdminDashBoardData = {
    lastInit: string;
    members: {
        total: number;
        actives: number;
        thisMonth: number;
    };
    tools: {
        total: number;
        used: number;
        thisMonth: number;
    };
    interventions: {
        total: number;
        pending: number;
        thisMonth: number;
    };
    contestations: {
        total: number;
        pending: number;
        thisMonth: number;
    };
};

export type MemberDashboardData = {
    pointsBalance: number;
    interventions: {
        total: number;
        thisMonth: number
        asWorker: number;
        pendingOtherValidation: number;
        asPayer: number;
        pendingMyValidation: number;
    },
    tools: {
        total: number;
        thisMonth: number;
        top3: {
            first: string;
            second: string;
            third: string;
        }
    },
    contestations: {
        total: number;
        thisMonth: number;
        fromMe: number;
        pending: number;
    }
}