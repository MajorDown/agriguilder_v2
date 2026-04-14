import useGetTools from "@/hooks/tools/useToolTable";
import useUserContext from "@/contexts/userContext/useUserContext";
import { useState } from "react";
import Image from "next/image";
import styles from "@/styles/components/application/ui/inputs/toolSelector.module.css";

export type ToolSelectorProps = {
    selectedTools: string[];
    onChange: (selectedTools: string[]) => void;
}

export default function ToolSelector(props: ToolSelectorProps) {
    const { selectedGuild } = useUserContext();
    const { tools, isLoading } = useGetTools(selectedGuild ?? "");

    const toggleTool = (toolId: string) => {
        if (props.selectedTools.includes(toolId)) {
            props.onChange(
                props.selectedTools.filter(id => id !== toolId)
            );
        } else {
            props.onChange(
                [...props.selectedTools, toolId]
            );
        }
    };

    return (
        <div className={styles.container}>
            <label>
                Renseignez les outils utilisés : ({props.selectedTools.length} sélectionnée(s))
            </label>

            <div className={styles.toolsList}>
                {!isLoading && tools.map(tool => (
                    <button
                        key={tool.id}
                        type="button"
                        onClick={() => toggleTool(tool.id)}
                        className={
                            props.selectedTools.includes(tool.id)
                                ? styles.checkedTool
                                : styles.tool
                        }
                    >
                        {tool.name}

                        {props.selectedTools.includes(tool.id) && (
                            <Image
                                src="/images/icons/check-dark-on-green.svg"
                                alt="check"
                                width={20}
                                height={20}
                            />
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}