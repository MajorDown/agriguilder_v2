export type VerifyAdminAuthInput = {
    userId: string;
    guildName: string;
};

export type CreateFirstGuildAdminInput = {
    guildId: string;
    email: string;
    firstname: string;
    lastname: string;
    phone: string;
    society?: string;
};

export type CreatedFirstGuildAdmin = {
    id: string;
    userId: string;
    guildId: string;
    email: string;
    firstname: string;
    lastname: string;
    phone: string;
    society: string | null;
};
