export default class FetchManager {
    private static refreshPromise: Promise<void> | null = null;

    /**
     * @description Méthode pour faire un fetch vers la route refresh session.
     * Si le rafraîchissement est réussi, la session est renouvelée
     * et les cookies d'authentification sont mis à jour.
     */
    static async fetchRefreshSession(): Promise<void> {
        if (!this.refreshPromise) {
            this.refreshPromise = (async () => {
                const response = await fetch("/api/session/refresh", {
                    method: "POST",
                    credentials: "include",
                });

                if (!response.ok) {
                    throw new Error("Échec du rafraîchissement de session");
                }
            })().finally(() => {
                this.refreshPromise = null;
            });
        }

        return this.refreshPromise;
    }

    /**
     * @description Méthode pour faire un fetch avec gestion automatique du rafraîchissement de session.
     * Si la réponse du fetch initial est un 401, la méthode tente de rafraîchir la session et de refaire le fetch.
     */
    static async fetch(url: string, options?: RequestInit): Promise<Response> {
        try {
            const requestOptions: RequestInit = {
                ...options,
                credentials: "include",
            };

            let response = await fetch(url, requestOptions);

            if (response.status === 401) {
                await this.fetchRefreshSession();
                response = await fetch(url, requestOptions);
            }

            return response;
        } catch (error) {
            console.error("Erreur lors du fetch API :", error);
            throw error;
        }
    }
}