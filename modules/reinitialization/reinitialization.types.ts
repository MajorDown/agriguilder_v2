export type CreateReinitializationInput = {
    guildName: string;
    nextGuildName: string;
    city: string;
    department: string;
    humanHourPointValue: number;
    maxDeclarationDelay: number;
    maxValidationDelay: number;
    maxContestationDelay: number;
    pointEuroValue: number;
    confirm: boolean;
    adminId: string;
}

export type ReinitializationReportLine = {
    memberId: string;
    firstname: string;
    lastname: string;
    email: string;
    pointsBalance: number;
    euroValue: number;
}

export type ReinitializationReport = {
    generatedAt: Date;
    validatedBy: string;
    previousGuildName: string;
    guildName: string;
    city: string;
    department: string;
    humanHourPointValue: number;
    maxDeclarationDelay: number;
    maxValidationDelay: number;
    maxContestationDelay: number;
    pointEuroValue: number;
    lines: ReinitializationReportLine[];
}

export type CreateReinitializationResult = {
    reinitializationId: string;
    guildId: string;
    guildName: string;
    createdAt: Date;
    report: ReinitializationReport;
}
