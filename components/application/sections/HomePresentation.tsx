'use client';
import { useState } from "react"
import Image from "next/image";
import styles from '@/styles/pages/home.module.css';

export default function HomeDescription() {
    const [ message, setMessage ] = useState<1 | 2 | 3 | 4 | 5>(1);
    const messages = [
        "Agriguilder est une application web qui permet de favoriser et gérer l'entraide au sein de votre collectif.",
        "En tant que membre de votre guilde, vous pouvez déclarer une intervention que vous aurez réalisée pour un autre membre.",
        "En déclarant une intervention, votre compteur de points augmente en fonction de la nature de l'intervention, ainsi que le nombre d'heures effectuées.",
        "Le membre qui aura bénéficié de votre intervention, quand à lui, verra son compteur de points diminuer de la même valeur.",
        "Ce système, sollicité à l'origine par un collectif agricole vendéen, vise à péréniser et équilibrer l'entraide entre chaque membre."
    ]

    return (<div id={styles.homePresentation}>
        <div id={styles.message}>
            <p>{messages[message - 1]}</p>
            {message !== 1 && <div id={styles.points}>
                <Image 
                    src={message === 2 ? "/images/icons/select-white.svg" : "/images/icons/unselect-white.svg"} 
                    alt={`point_2`} 
                    width={10} 
                    height={10} 
                />
                <Image 
                    src={message === 3 ? "/images/icons/select-white.svg" : "/images/icons/unselect-white.svg"} 
                    alt={`point_3`}
                    width={10}
                    height={10}
                />
                <Image
                    src={message === 4 ? "/images/icons/select-white.svg" : "/images/icons/unselect-white.svg"}
                    alt={`point_4`}
                    width={10}
                    height={10}
                />
                <Image
                    src={message === 5 ? "/images/icons/select-white.svg" : "/images/icons/unselect-white.svg"}
                    alt={`point_5`}
                    width={10}
                    height={10}
                />
            </div>}
        </div>
        <Image 
            src="/images/icons/arrow-right-white.svg" 
            alt="suivant" 
            width={50} 
            height={50} 
            onClick={() => setMessage(message === 5 ? 1 : (message + 1) as 1 | 2 | 3 | 4 | 5)}
        />
    </div>)
}