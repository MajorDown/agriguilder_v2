import Link from "next/link";
import Image from "next/image";
import LoginBtn from "../ui/buttons/LoginBtn";
import GuildSelect from "../ui/inputs/GuildSelect";

const dataForGuildSelect = [
    { label: "Guilde 1", value: "guilde1" },
    { label: "Guilde 2", value: "guilde2" },
    { label: "Guilde 3", value: "guilde3" },
];

export default function Header() {
    return (<header>
        <Link id="appTitle" href={"/"}>
            <Image src="/images/icons/logo-white.svg" alt="logo" width={45} height={59} priority/>
            <h1>Agriguilder</h1>
        </Link>
        <div id={"welcomer"}>
            <p>Bienvenue, Romain !</p>
            <p>votre guilde : <GuildSelect guilds={dataForGuildSelect} /></p>
        </div>
        <LoginBtn />
    </header>);
}