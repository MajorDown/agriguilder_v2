import { updateAllGuildsMembersPointsBalance } from "@/modules/cron/services/updateAllMembersPointsBalance.service";
import LogManager from "@/managers/LogManager";

async function main(): Promise<void> {
    LogManager.log("Début de la mise à jour du solde de points de tous les membres de toutes les guildes")
    const result = await updateAllGuildsMembersPointsBalance();
    for (const success of result.successes) {
        LogManager.log(`guilde ${success.guildName} : succès du recalcul pour ${success.recalculatedMembersCount} membres`);
    }
    for (const failure of result.failures) {
        LogManager.error(`guilde ${failure.guildName} : échec du recalcul des points des membres - ${failure.errorMessage}`);
    }
    if (result.failureCount === 0) {
        LogManager.log(`${result.successCount} guilde(s) ont été traitée(s) avec succès`);
        return;
    }
    LogManager.log(
        `${result.successCount} guilde(s) traitée(s) avec succès, ${result.failureCount} en échec sur ${result.totalGuilds}`
    );
    process.exitCode = 1;
}

main().catch((error) => {
    LogManager.error(`Une erreur critique est survenue lors de la mise à jour du solde de points des membres : ${error instanceof Error ? error.message : "Erreur inconnue"}`);
    process.exit(1);
});