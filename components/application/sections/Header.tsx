'use client';
import Link from "next/link";
import Image from "next/image";
import LoginBtn from "../ui/buttons/LoginBtn";
import GuildSelect from "../ui/inputs/GuildSelect";
import useUserContext from "@/contexts/userContext/useUserContext";
import LogoutBtn from "../ui/buttons/LogoutBtn";

export default function Header() {
    const { user } = useUserContext();
    console.log("User in header :", user);

    // Préparer les données pour le GuildSelect
    // si il y a des doublons en terme de nom de guilde, on les filtres pour n'avoir que des guildes uniques
    const dataForGuildSelect = user?.relations?.map((relation) => ({
        value: relation.guildId,
        label: relation.guildName,
    })).filter((guild, index, self) =>
        index === self.findIndex((g) => g.value === guild.value)
    ) || [];

    return (<header>
        <Link id="appTitle" href={"/"}>
            <Image src="/images/icons/logo-white.svg" alt="logo" width={45} height={59} priority/>
            <h1>Agriguilder</h1>
        </Link>
        {user?.id && <div id={"welcomer"}>
            <p>Bienvenue, {user.firstname} !</p>
            <p>votre guilde : <GuildSelect guilds={dataForGuildSelect} /></p>
        </div>}
        {user?.id? <LogoutBtn /> : <LoginBtn />}
    </header>);
}