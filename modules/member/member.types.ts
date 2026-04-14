import { Member, User } from "@/prisma/generated/prisma/client";

export type PublicMember = Omit<Member, "updated_at" | "revoked_at" | "user_id" | "guild_id">
    & Omit<User, "id" | "guild_id" |"password_hash" | "created_at" | "updated_at" | "revoked_at">;

export type CheckMemberByEmailInput = {
    guildName: string;
    email: string;
};

export type ExistingUserPreview = {
    email: string;
    firstname: string;
    lastname: string;
    phone: string;
    society?: string | null;
};

export type CheckMemberByEmailResult =
    | {
        status: "MEMBER_ALREADY_EXISTS";
        message: string;
    }
    | {
        status: "USER_EXISTS";
        message: string;
        user: ExistingUserPreview;
    }
    | {
        status: "USER_NOT_FOUND";
        message: string;
    };

export type CreateMemberInput = {
    email: string;
    guildName: string;
    firstname: string;
    lastname: string;
    phone: string;
    society?: string;
}

export type VerifyMemberAuthInput = {
    userId: string;
    guildName: string;
};