'use client';

import { PropsWithChildren, useEffect } from 'react';
import NavBar from '../nav/NavBar';
import styles from '@/styles/components/application/ui/appPage.module.css';
import useUserContext from '@/contexts/userContext/useUserContext';
import { useRouter } from 'next/navigation';
import AppSpinner from './AppSpinner';

type Role = 'membre' | 'admin' | 'employé';
type AccessRequirement = Role | 'visiteur' | 'user';

export type AppPageProps = PropsWithChildren<{
    title?: string;
    requiredRole?: AccessRequirement[];
    forDev?: boolean; // si la page exige d'être dev
}>;

export default function AppPage(props: AppPageProps) {
    const router = useRouter();
    const { user, isLoading, selectedGuild, selectedRole } = useUserContext();

    const isConnected = !!user?.id;

    const userRoles: Role[] =
        user?.relations
            ?.filter((relation) => !selectedGuild || relation.guildName === selectedGuild)
            .map((relation) => relation.role as Role) || [];
    const selectedRoleBelongsToGuild = !selectedRole || userRoles.includes(selectedRole as Role);

    const isAuthorized = !props.requiredRole
        ? true
        : props.requiredRole.some((required) => {
              if (required === 'visiteur') {
                  return !isConnected;
              }

              if (required === 'user') {
                  return isConnected;
              }

              return selectedRole === required && selectedRoleBelongsToGuild;
          });
    const isDevAuthorized = !props.forDev || !!user?.isDev;
    const canAccess = isAuthorized && isDevAuthorized;

    useEffect(() => {
        if (!isLoading && !canAccess) {
            const timer = setTimeout(() => {
                router.push('/');
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [isLoading, canAccess, router]);

    if (isLoading) {
        return (
            <article className={styles.appPage}>
                <p>Chargement...</p>
                <AppSpinner />
            </article>
        );
    }

    return (
        <>
            {isConnected && <NavBar />}
            <article className={styles.appPage}>
                {canAccess ? (
                    <>
                        {props.title && <h2>{props.title}</h2>}
                        {props.children}
                    </>
                ) : (
                    <div className={styles.notAuthorized}>
                        <h2>Accès refusé</h2>
                        <p>Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
                        <p>Redirection en cours...</p>
                    </div>
                )}
            </article>
        </>
    );
}
