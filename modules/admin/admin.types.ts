export type VerifyAdminAuthInput = {
    userId: string;
    guildName: string;
};

export type ExistingAdminUserPreview = {
    email: string;
    firstname: string;
    lastname: string;
    phone: string;
    society?: string | null;
};

export type CheckAdminByEmailInput = {
    guildName: string;
    email: string;
};

export type CheckAdminByEmailResult =
    | {
        status: "ADMIN_ALREADY_EXISTS";
        message: string;
    }
    | {
        status: "USER_EXISTS";
        message: string;
        user: ExistingAdminUserPreview;
    }
    | {
        status: "USER_NOT_FOUND";
        message: string;
    };

export type CreateAdminInput = {
    guildName: string;
    email: string;
    firstname: string;
    lastname: string;
    phone: string;
    society?: string;
};

export type CreatedAdmin = {
    id: string;
    userId: string;
    guildId: string;
    email: string;
    firstname: string;
    lastname: string;
    phone: string;
    society: string | null;
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
