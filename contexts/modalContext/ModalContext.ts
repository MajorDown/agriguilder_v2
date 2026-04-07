'use client';

import { createContext } from "react";
import { ReactNode } from "react";

export type ModalSize = "small" | "medium" | "large";

export type OpenModalParams = {
    title?: string;
    content: ReactNode;
    size?: ModalSize;
    closeOnBackdropClick?: boolean;
};

export type ModalContextType = {
    isOpen: boolean;
    title?: string;
    content: ReactNode | null;
    size: ModalSize;
    closeOnBackdropClick: boolean;
    openModal: (params: OpenModalParams) => void;
    closeModal: () => void;
};

const ModalContext = createContext<ModalContextType | null>(null);

export default ModalContext;