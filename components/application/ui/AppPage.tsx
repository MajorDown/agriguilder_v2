'use client';

import { PropsWithChildren, useEffect } from 'react';
import styles from '@/styles/components/application/ui/appPage.module.css';
import useUserContext from '@/contexts/userContext/useUserContext';
import { useRouter } from 'next/navigation';

type Role = 'membre' | 'admin' | 'employé';
type AccessRequirement = Role | 'visiteur';

export type AppPageProps = PropsWithChildren<{
    title?: string;
    requiredRole?: AccessRequirement[];
}>;

export default function AppPage(props: AppPageProps) {
    const router = useRouter();
    const { user, isLoading } = useUserContext();

    const userRoles: Role[] =
        user?.relations?.map((relation) => relation.role as Role) || [];

    const isAuthorized = !props.requiredRole
        ? true
        : props.requiredRole.includes('visiteur')
            ? !user
            : props.requiredRole.some((role) =>
                  role !== 'visiteur' && userRoles.includes(role)
            );

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
            </article>
        );
    }

    return (
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
    );
}