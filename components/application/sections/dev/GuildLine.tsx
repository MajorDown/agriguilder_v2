'use client';

import Image from "next/image";
import { PublicGuildWithData } from "@/modules/guild/guild.types";
import Styles from "@/styles/pages/dev.module.css";

export type GuildLineProps = {
    guild: PublicGuildWithData;
};

export default function GuildLine(props: GuildLineProps) {
    const { guild } = props;

    return (
        <div className={Styles.guildLine}>
            <p>{guild.name}</p>
            <p>{guild.city} - {guild.department}</p>
            <p>{new Date(guild.created_at).toLocaleDateString("fr-FR")}</p>
            <p>{guild.members.length}</p>
            <p>{guild.admins.length}</p>
            <p>{guild.tools.length}</p>
            <button
                type="button"
                onClick={() => {}}
            >
                <Image
                    src="/images/icons/show-dark-on-green.svg"
                    alt="détails"
                    width={30}
                    height={30}
                />
            </button>
        </div>
    );
}