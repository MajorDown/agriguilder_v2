import { PublicRule } from "@/modules/rule/rule.types";

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
    rules: PublicRule[];
}