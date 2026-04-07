'use client';
import { useState} from "react";
import Image from "next/image";
import { Tool } from "@/prisma/generated/prisma/client";
import styles from "@/styles/components/application/sections/toolTable.module.css";

export type ToolLineProps = {
    // un tool doit contenir un Tool mais sans les champs de date et admin_id
    tool: Omit<Tool, 'created_at' | 'revoked_at' | 'admin_id' | 'guild_id'>;
}
export default function ToolLine(props: ToolLineProps) {
    const [ isEditing, setIsEditing] = useState<boolean>(false);

    return (<div className={styles.toolLine}>
        {!isEditing &&<button>
            <Image src="/images/icons/edit-dark-on-green.svg" alt="edit" width={30} height={30} />          
        </button>}
        {isEditing &&<button >
            <Image src="/images/icons/check-dark-on-green.svg" alt="confirm" width={30} height={30} />          
        </button>}
        <p>{props.tool.name}</p>
        <p>{props.tool.coef}</p>
        <p>{props.tool.is_active ? "Actif" : "Inactif"}</p>
        <p>v{props.tool.version}</p>
        <button onClick={() => setIsEditing(!isEditing)}>
            <Image src="/images/icons/trash-dark-on-green.svg" alt="delete" width={30} height={30} />            
        </button>
    </div>)
}