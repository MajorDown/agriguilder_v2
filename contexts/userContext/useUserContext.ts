"use client";
import { useContext } from "react";
import UserContext from "./UserContext";

export default function useUserContext() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUserContext doit être utilisé dans un UserProvider");
    }
    return context;
}