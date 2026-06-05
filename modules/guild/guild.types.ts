import { PublicRule } from "@/modules/rule/rule.types";

export type CreateGuildInput = {
    name: string;
    city: string;
    department: string;
    humanHourPointValue: number;
    maxDeclarationDelay: number;
    maxContestationDelay: number;
};

export type CreatedGuild = {
    id: string;
    name: string;
    city: string;
    department: string;
    human_hour_point_value: number;
    max_declaration_delay: number;
    max_validation_delay: number;
    max_contestation_delay: number;
};

export type PublicGuildWithRules = {
    id: string;
    name: string;
    latitude: number | null;
    longitude: number | null;
    city: string;
    department: string;
    human_hour_point_value: number;
    max_declaration_delay: number;
    max_validation_delay: number;
    max_contestation_delay: number;
    created_at: Date;
    updated_at: Date;
    admins: {
        id: string;
        created_at: Date;
        user: {
            email: string;
            firstname: string;
            lastname: string;
            phone: string;
            society: string | null;
        };
    }[];
    rules: PublicRule[];
}

export type PublicGuildWithData = {
    name: string;
    id: string;
    created_at: Date;
    city: string;
    department: string;
    updated_at: Date;
    subscriptions: {
        created_at: Date;
        package: string;
        ends_at: Date;
        revoked_at: Date | null;
    }[];
    reinitializations: {
        admin_id: string;
        created_at: Date;
        point_euro_value: number;
    }[];
    members: {
        revoked_at: Date | null;
        user: {
            email: string;
            firstname: string;
            lastname: string;
            phone: string;
        };
    }[];
    admins: {
        revoked_at: Date | null;
        user: {
            email: string;
            firstname: string;
            lastname: string;
            phone: string;
        };
    }[];
    rules: {
        content: string;
        created_at: Date;
    }[];
    tools: {
        name: string;
        unit: string;
        coef: number;
        version: string;
        is_active: boolean;
    }[];
}
