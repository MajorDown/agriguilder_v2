'use client';
import { PropsWithChildren, useEffect } from "react";
import styles from "@/styles/components/application/ui/appModal.module.css";
import AppBtn from "./buttons/AppBtn";

export type AppModalProps = PropsWithChildren<{
    isOpen: boolean;
    title?: string;
    onClose: () => void;
    closeOnBackdropClick?: boolean;
    size?: "small" | "medium" | "large";
}>;

export default function AppModal(props: AppModalProps) {
    const {
        isOpen,
        title,
        children,
        onClose,
        closeOnBackdropClick = true,
        size = "medium",
    } = props;

    useEffect(() => {
        if (!isOpen) {
            return;
        }
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = originalOverflow;
        };
    }, [isOpen, onClose]);

    if (!isOpen) {
        return null;
    }

    return (<div
        className={styles.backdrop}
        onClick={() => {
            if (closeOnBackdropClick) {
                onClose();
            }
        }}
    >
        <div
            className={`${styles.modal} ${styles[size]}`}
            onClick={(event) => event.stopPropagation()}
        >
            <div className={styles.header}>
                <div className={styles.titleBlock}>
                    {title && <h3>{title}</h3>}
                </div>

                <AppBtn 
                    onClick={onClose}
                    label={"Fermer"} 
                    color={"light"}
                />
            </div>

            <div className={styles.content}>
                {children}
            </div>
        </div>
    </div>);
}