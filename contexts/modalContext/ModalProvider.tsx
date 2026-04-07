'use client';
import { ReactNode, useCallback, useMemo, useState } from "react";
import ModalContext, { ModalSize, OpenModalParams } from "./ModalContext";
import AppModal from "@/components/application/ui/AppModal";

type ModalState = {
    isOpen: boolean;
    title?: string;
    content: ReactNode | null;
    size: ModalSize;
    closeOnBackdropClick: boolean;
};

type ModalProviderProps = {
    children: ReactNode;
};

export default function ModalProvider({ children }: ModalProviderProps) {
    const [modalState, setModalState] = useState<ModalState>({
        isOpen: false,
        title: undefined,
        content: null,
        size: "medium",
        closeOnBackdropClick: true,
    });

    const openModal = useCallback((params: OpenModalParams) => {
        setModalState({
            isOpen: true,
            title: params.title,
            content: params.content,
            size: params.size ?? "medium",
            closeOnBackdropClick: params.closeOnBackdropClick ?? true,
        });
    }, []);

    const closeModal = useCallback(() => {
        setModalState({
            isOpen: false,
            title: undefined,
            content: null,
            size: "medium",
            closeOnBackdropClick: true,
        });
    }, []);

    const value = useMemo(() => ({
        isOpen: modalState.isOpen,
        title: modalState.title,
        content: modalState.content,
        size: modalState.size,
        closeOnBackdropClick: modalState.closeOnBackdropClick,
        openModal,
        closeModal,
    }), [modalState, openModal, closeModal]);

    return (
        <ModalContext.Provider value={value}>
            {children}

            <AppModal
                isOpen={modalState.isOpen}
                title={modalState.title}
                onClose={closeModal}
                size={modalState.size}
                closeOnBackdropClick={modalState.closeOnBackdropClick}
            >
                {modalState.content}
            </AppModal>
        </ModalContext.Provider>
    );
}