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
        email: string;
        phone: string | null;
        relations: GuildRelation[];
} | null;

export type UserContext = {
    user: UserAppData;
    setUser: (user: UserAppData) => void;

    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;

    selectedGuild: string | null;
    setSelectedGuild: (guildId: string | null) => void;
}