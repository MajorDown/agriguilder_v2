import { NextRequest } from "next/server";
import ResponseManager from "@/managers/ResponseManager";
import LogManager from "@/managers/LogManager";
import { getUserAppData } from "@/contexts/userContext/getUserContext.service";

export async function GET(request: NextRequest) {
    try {
        const userAppData = await getUserAppData();
        return ResponseManager.success(userAppData);
    } catch (error) {
        LogManager.error(`Erreur lors du chargement du contexte utilisateur : ${error}`);
        return ResponseManager.error(error);
    }
}