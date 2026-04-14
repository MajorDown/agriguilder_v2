export type CreateInterventionInput = {
    guildName: string;
    workerId: string;
    payerId: string;
    day: string;
    duration: number;
    tools: string[];
    description?: string | null;
}