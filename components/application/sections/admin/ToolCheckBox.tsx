'use client';

import styles from '@/styles/components/application/sections/toolTable.module.css';
import useToolSwitch from '@/hooks/tools/useToolSwitch';

export type ToolSwitchProps = {
    toolId: string;
    guildName: string;
    initialIsActive: boolean;
};

/**
 * @description Composant représentant un interrupteur pour activer ou désactiver un outil
 * @param props Propriétés du composant ToolSwitch
 * @returns JSX.Element
 */
export default function ToolSwitch(props: ToolSwitchProps) {
    const { isActive, isSubmitting, toggleTool } = useToolSwitch({
        toolId: props.toolId,
        guildName: props.guildName,
        initialIsActive: props.initialIsActive,
    });

    return (
        <div
            className={[
                styles.toolSwitch,
                isActive ? styles.active : styles.inactive,
                isSubmitting ? styles.disabled : "",
            ].join(" ")}
            onClick={() => {
                void toggleTool();
            }}
        >
            <div className={styles.switchCursor}></div>

            <p className={styles.switchLabel}>
                {isActive ? "Actif" : "Inactif"}
            </p>
        </div>
    );
}