'use client';
import styles from '@/styles/components/application/ui/buttons/appBtn.module.css';

export type AppBtnProps = {
    label: string;
    type?: "button" | "submit";
    checked?: boolean;
    onClick?: () => void;
    color: 'dark' | 'light' | 'green';
}

export default function AppBtn(props: AppBtnProps) {
    return (<button
        type={props.type ?? "button"}
        className={`${styles.appBtn} ${styles[props.color]}`}
        onClick={props.onClick}
    >
        <p>{props.checked && <span>&#10003;</span>}{props.label}</p>
    </button>
    )
}