'use client';

import { useContext } from "react";
import ModalContext from "./ModalContext";

export default function useModal() {
    const context = useContext(ModalContext);

    if (!context) {
        throw new Error("useModal doit être utilisé dans un ModalProvider.");
    }

    return context;
}