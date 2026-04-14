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
}>;

export default function AppPage(props: AppPageProps) {
    const router = useRouter();
    const { user, isLoading } = useUserContext();

    const isConnected = !!user?.id;

    const userRoles: Role[] =
        user?.relations?.map((relation) => relation.role as Role) || [];

    const isAuthorized = !props.requiredRole
        ? true
        : props.requiredRole.some((required) => {
              if (required === 'visiteur') {
                  return !isConnected;
              }

              if (required === 'user') {
                  return isConnected;
              }

              return userRoles.includes(required);
          });

    useEffect(() => {
        if (!isLoading && !isAuthorized) {
            const timer = setTimeout(() => {
                router.push('/');
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [isLoading, isAuthorized, router]);

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
                {isAuthorized ? (
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