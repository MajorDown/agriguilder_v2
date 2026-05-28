export type GuildRole = 'membre' | 'admin' | 'employé';

export type GuildRelation = {
    guildId: string;
    guildName: string;
    sinceAt: string;
    role: GuildRole;
}

export type UserAppData = {
        id: string;
        firstname: string;
        lastname: string;
        society?: string;
        email: string;
        phone: string | null;
        isDev?: boolean;
        relations: GuildRelation[];
} | null;

export type UserContext = {
    user: UserAppData;
    setUser: (user: UserAppData) => void;

    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;

    selectedGuild: string | null;
    setSelectedGuild: (guildId: string | null) => void;

    selectedRole: GuildRole | null;
    setSelectedRole: (role: GuildRole | null) => void;

    refreshUser: () => Promise<void>;
}