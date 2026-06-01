'use client';

import Image from "next/image";
import { PublicGuildWithData } from "@/modules/guild/guild.types";
import Styles from "@/styles/pages/dev.module.css";
import useModal from "@/contexts/modalContext/useModal";
import GuildDetailsModal from "./GuildDetailsModal";

export type GuildLineProps = {
    guild: PublicGuildWithData;
};

export default function GuildLine(props: GuildLineProps) {
    const { guild } = props;
    const { openModal } = useModal();

    const handleOpenDetails = () => {
        openModal({
            title: `Détails de ${guild.name}`,
            size: "large",
            content: (
                <GuildDetailsModal guild={guild} />
            ),
        });
    };

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
                onClick={handleOpenDetails}
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