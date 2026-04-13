'use client';
import GuildInformations from "@/components/application/sections/admin/GuildInformations";
import RuleTable from "@/components/application/sections/admin/RuleTable";
import AppPage from "@/components/application/ui/AppPage";
import useUserContext from "@/contexts/userContext/useUserContext";
import useGuildWithRules from "@/hooks/guild/useGuildWithRules";

export default function GuildPage() {
    const { selectedGuild } = useUserContext();
    const { guild, isLoading, errorMessage, refreshGuild } = useGuildWithRules(selectedGuild);

    console.log("Guild with rules:", guild);

    return (
        <AppPage title="Gestion de la guilde" requiredRole={["admin"]}>
            {isLoading && <p>Chargement de la guilde...</p>}
            {errorMessage && <p>{errorMessage}</p>}
            {!isLoading && !errorMessage && guild && (
                <>
                    <GuildInformations guild={guild} />
                    <RuleTable rules={guild.rules} guildName={guild.name} onRefresh={refreshGuild} />
                </>
            )}
        </AppPage>
    );
}