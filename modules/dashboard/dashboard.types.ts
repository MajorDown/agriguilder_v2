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