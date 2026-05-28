type InterventionToolForValue = {
    coef: number;
    unit: "HEURE" | "HECTARE";
};

export type InterventionForValue = {
    duration: number | null;
    surface: number | null;
    tools: InterventionToolForValue[];
};

/**
 * @description Calcule les points d'une intervention en fonction de sa durée, de sa surface et des coefficients de ses outils.
 * @param {InterventionForValue} intervention - L'intervention pour laquelle calculer les points.
 * @returns {number} Le nombre de points de l'intervention.
 */
export function calculateInterventionValue(intervention: InterventionForValue): number {
    return intervention.tools.reduce((total, tool) => {
        if (tool.unit === "HECTARE") {
            return total + ((intervention.surface ?? 0) * tool.coef);
        }

        return total + ((intervention.duration ?? 0) * tool.coef);
    }, 0);
}

/**
 * @description Formate les points d'une intervention en une chaîne de caractères avec deux décimales.
 * @param {number} points - Le nombre de points à formater.
 * @returns {string} Les points formatés.
 */
export function formatInterventionValue(points: number): string {
    return points.toLocaleString("fr-FR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}