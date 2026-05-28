'use client';
import Link from "next/link";
import Image from "next/image";
import LoginBtn from "../ui/buttons/LoginBtn";
import GuildSelect from "../ui/inputs/GuildSelect";
import useUserContext from "@/contexts/userContext/useUserContext";
import LogoutBtn from "../ui/buttons/LogoutBtn";
import RoleSelect from "../ui/inputs/RoleSelect";

export default function Header() {
    const { user } = useUserContext();

    const dataForGuildSelect = user?.relations?.map((relation) => ({
        value: relation.guildName,
        label: relation.guildName,
    })).filter((guild, index, self) =>
        index === self.findIndex((g) => g.value === guild.value)
    ) || [];

    const dataForRoleSelect = user?.relations?.map((relation) => ({
        value: relation.role,
        label: relation.role,
    })).filter((role, index, self) =>
        index === self.findIndex((r) => r.value === role.value)
    ) || [];

    return (<header>
        <Link id="appTitle" href={"/"}>
            <Image src="/images/icons/logo-white.svg" alt="logo" width={45} height={59} priority/>
            <h1>Agriguilder</h1>
        </Link>
        {user?.isDev && (<div>DEV</div>)}
        {user?.id && <div id={"welcomer"}>
            <p>Bienvenue, {user.firstname} !</p>
            <p>votre guilde : <GuildSelect guilds={dataForGuildSelect} /></p>
            <p>votre rôle : <RoleSelect roles={dataForRoleSelect} /></p>
        </div>}
        {user?.id? <LogoutBtn /> : <LoginBtn />}
    </header>);
}