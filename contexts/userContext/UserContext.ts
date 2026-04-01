"use client";
import { createContext } from "react";
import type { UserContext } from "./userContext.types";

const UserContext = createContext<UserContext | null>(null);

export default UserContext;