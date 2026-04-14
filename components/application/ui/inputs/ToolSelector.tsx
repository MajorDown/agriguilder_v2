import useGetTools from "@/hooks/tools/useToolTable";
import useUserContext from "@/contexts/userContext/useUserContext";
import { useState } from "react";
import Image from "next/image";
import styles from "@/styles/components/application/ui/inputs/toolSelector.module.css";

export default function ToolSelector() {
    const { selectedGuild } = useUserContext();
    const {tools, isLoading} = useGetTools(selectedGuild ?? "");
    const [ selectedTools, setSelectedTools ] = useState<string[]>([]);

    const toggleTool = (toolId: string) => {
        setSelectedTools(prev => {
            if (prev.includes(toolId)) {
                return prev.filter(id => id !== toolId);
            } else {
                return [...prev, toolId];
            }
        })
    }

    return (<div className={styles.container}>
        <label htmlFor="">Renseignez les outils utilisés : ({selectedTools.length} sélectionnée(s))</label>
        <div className={styles.toolsList}>
            {!isLoading && tools.map(tool => (<button
                key={tool.id}
                type={'button'}
                onClick={() => toggleTool(tool.id)}
                className={selectedTools.includes(tool.id) ? styles.checkedTool : styles.tool}
            >
                {tool.name}
                {selectedTools.includes(tool.id) && <Image 
                    src={'/images/icons/check-dark-on-green.svg'} 
                    alt={'develop'} 
                    width={20} 
                    height={20}/>}
            </button>))}
        </div>
    </div>)
}