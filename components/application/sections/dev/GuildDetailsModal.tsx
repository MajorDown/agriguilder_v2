'use client';

import { PublicGuildWithData } from "@/modules/guild/guild.types";
import Styles from "@/styles/pages/dev.module.css";

export type GuildDetailsModalProps = {
    guild: PublicGuildWithData;
};

export default function GuildDetailsModal(props: GuildDetailsModalProps) {
    const { guild } = props;

    const activeMembers = guild.members.filter((member) => !member.revoked_at);
    const revokedMembers = guild.members.filter((member) => member.revoked_at);

    const activeAdmins = guild.admins.filter((admin) => !admin.revoked_at);
    const revokedAdmins = guild.admins.filter((admin) => admin.revoked_at);

    const activeTools = guild.tools.filter((tool) => tool.is_active);
    const inactiveTools = guild.tools.filter((tool) => !tool.is_active);

    const activeSubscription = guild.subscriptions.find(
        (subscription) => !subscription.revoked_at
    );

    return (
        <div className={Styles.modalContainer}>
            <section>
                <h4>Informations générales</h4>
                <p><strong>Nom :</strong> {guild.name}</p>
                <p><strong>Localisation :</strong> {guild.city} - {guild.department}</p>
                <p>
                    <strong>Créée le :</strong>{" "}
                    {new Date(guild.created_at).toLocaleDateString("fr-FR")}
                </p>
                <p>
                    <strong>Dernière mise à jour :</strong>{" "}
                    {new Date(guild.updated_at).toLocaleDateString("fr-FR")}
                </p>
            </section>

            <section>
                <h4>Abonnement</h4>
                {activeSubscription ? (
                    <>
                        <p><strong>Package :</strong> {activeSubscription.package}</p>
                        <p>
                            <strong>Début :</strong>{" "}
                            {new Date(activeSubscription.created_at).toLocaleDateString("fr-FR")}
                        </p>
                        <p>
                            <strong>Fin :</strong>{" "}
                            {new Date(activeSubscription.ends_at).toLocaleDateString("fr-FR")}
                        </p>
                    </>
                ) : (
                    <p>Aucun abonnement actif.</p>
                )}
            </section>

            <section>
                <h4>Membres</h4>
                <p><strong>Actifs :</strong> {activeMembers.length}</p>
                <p><strong>Révoqués :</strong> {revokedMembers.length}</p>

                {activeMembers.length > 0 && (
                    <ul>
                        {activeMembers.map((member) => (
                            <li key={member.user.email}>
                                {member.user.firstname} {member.user.lastname}
                                {" - "}
                                {member.user.email}
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            <section>
                <h4>Admins</h4>
                <p><strong>Actifs :</strong> {activeAdmins.length}</p>
                <p><strong>Révoqués :</strong> {revokedAdmins.length}</p>

                {activeAdmins.length > 0 && (
                    <ul>
                        {activeAdmins.map((admin) => (
                            <li key={admin.user.email}>
                                {admin.user.firstname} {admin.user.lastname}
                                {" - "}
                                {admin.user.email}
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            <section>
                <h4>Outils</h4>
                <p><strong>Actifs :</strong> {activeTools.length}</p>
                <p><strong>Inactifs :</strong> {inactiveTools.length}</p>

                {guild.tools.length > 0 ? (
                    <ul>
                        {guild.tools.map((tool) => (
                            <li key={`${tool.name}-${tool.version}`}>
                                {tool.name} - coef {tool.coef} - {tool.unit} - v{tool.version}
                                {" "}
                                {tool.is_active ? "(actif)" : "(inactif)"}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Aucun outil renseigné.</p>
                )}
            </section>

            <section>
                <h4>Règles</h4>
                {guild.rules.length > 0 ? (
                    <ul>
                        {guild.rules.map((rule, index) => (
                            <li key={`${rule.created_at}-${index}`}>
                                {rule.content}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Aucune règle renseignée.</p>
                )}
            </section>

            <section>
                <h4>Réinitialisations</h4>
                {guild.reinitializations.length > 0 ? (
                    <ul>
                        {guild.reinitializations.map((reinitialization, index) => (
                            <li key={`${reinitialization.created_at}-${index}`}>
                                {new Date(reinitialization.created_at).toLocaleDateString("fr-FR")}
                                {" - "}
                                valeur : {reinitialization.point_euro_value}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Aucune réinitialisation.</p>
                )}
            </section>
        </div>
    );
}