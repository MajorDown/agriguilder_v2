import { PropsWithChildren } from "react";
import styles from '@/styles/components/application/ui/appPage.module.css';

export type AppPageProps = PropsWithChildren<{
    title: string;
    requiredRole?: ('admin' | 'member' | 'employee')[];
}>

export default function AppPage(props: AppPageProps) {
    return (
        <article className={styles["appPage"]}>
            <h2>{props.title}</h2>
            {props.children}
        </article>
    );
}