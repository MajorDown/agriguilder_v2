'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import styles from '@/styles/components/application/ui/appCalendar.module.css';
import useUserContext from '@/contexts/userContext/useUserContext';
import useMemberInterventions from '@/hooks/interventions/useGetInterventionsByMember';
import { PublicIntervention } from '@/modules/intervention/intervention.types';
import useModal from '@/contexts/modalContext/useModal';
import InterventionCalendarModal from '@/components/application/sections/admin/InterventionCalendarModal';

export type AppCalendarProps = {
    initialMonth: number;
    initialYear: number;
};

type CalendarCell = {
    key: string;
    dayNumber?: number;
    interventions: PublicIntervention[];
    isEmpty: boolean;
    isToday: boolean;
};

const WEEK_DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

export default function AppCalendar(props: AppCalendarProps) {
    const { selectedGuild } = useUserContext();
    const { openModal } = useModal();

    const {
        interventions,
        isLoading,
        errorMessage,
    } = useMemberInterventions(selectedGuild ?? undefined);

    const [currentMonth, setCurrentMonth] = useState(props.initialMonth);
    const [currentYear, setCurrentYear] = useState(props.initialYear);

    const todayKey = useMemo(() => {
        const today = new Date();
        return buildDateKey(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
        );
    }, []);

    const monthLabel = useMemo(() => {
        const formatter = new Intl.DateTimeFormat('fr-FR', {
            month: 'long',
            year: 'numeric',
        });

        return capitalize(
            formatter.format(new Date(currentYear, currentMonth, 1))
        );
    }, [currentMonth, currentYear]);

    const interventionsByDay = useMemo(() => {
        const result = new Map<string, PublicIntervention[]>();

        for (const intervention of interventions) {
            const date = new Date(intervention.day);
            const key = buildDateKey(
                date.getFullYear(),
                date.getMonth(),
                date.getDate()
            );

            const existing = result.get(key) ?? [];
            existing.push(intervention);
            result.set(key, existing);
        }

        return result;
    }, [interventions]);

    const cells = useMemo((): CalendarCell[] => {
        const result: CalendarCell[] = [];
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const jsDay = firstDayOfMonth.getDay();
        const firstDayIndex = jsDay === 0 ? 6 : jsDay - 1;
        for (let i = 0; i < firstDayIndex; i++) {
            result.push({
                key: `empty-${currentYear}-${currentMonth}-${i}`,
                isEmpty: true,
                interventions: [],
                isToday: false,
            });
        }
        for (let day = 1; day <= daysInMonth; day++) {
            const key = buildDateKey(currentYear, currentMonth, day);
            result.push({
                key,
                dayNumber: day,
                isEmpty: false,
                interventions: interventionsByDay.get(key) ?? [],
                isToday: key === todayKey,
            });
        }

        return result;
    }, [currentMonth, currentYear, interventionsByDay, todayKey]);

    function handlePreviousMonth() {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear((prev) => prev - 1);
            return;
        }
        setCurrentMonth((prev) => prev - 1);
    }

    function handleNextMonth() {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear((prev) => prev + 1);
            return;
        }
        setCurrentMonth((prev) => prev + 1);
    }

    function handleOpenDayModal(dayNumber: number, dayInterventions: PublicIntervention[]) {
        const date = new Date(currentYear, currentMonth, dayNumber);
        const dateLabel = new Intl.DateTimeFormat('fr-FR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        }).format(date);
        openModal({
            title: `Interventions du ${dateLabel}`,
            size: 'large',
            content: (
                <InterventionCalendarModal
                    dateLabel={dateLabel}
                    interventions={dayInterventions}
                />
            ),
        });
    }

    if (isLoading) {
        return (
            <section className={styles.calendar}>
                <p>Chargement des interventions...</p>
            </section>
        );
    }

    if (errorMessage) {
        return (
            <section className={styles.calendar}>
                <p>{errorMessage}</p>
            </section>
        );
    }

    return (
        <section className={styles.calendar}>
            <div className={styles.header}>
                <button
                    type="button"
                    className={styles.navButton}
                    onClick={handlePreviousMonth}
                    aria-label="Mois précédent"
                >
                    ←
                </button>
                <p className={styles.title}>{monthLabel}</p>
                <button
                    type="button"
                    className={styles.navButton}
                    onClick={handleNextMonth}
                    aria-label="Mois suivant"
                >
                    →
                </button>
            </div>

            <div className={styles.weekHeader}>
                {WEEK_DAYS.map((weekDay) => (
                    <div key={weekDay} className={styles.weekDay}>
                        {weekDay}
                    </div>
                ))}
            </div>

            <div className={styles.grid}>
                {cells.map((cell) => {
                    if (cell.isEmpty) {
                        return (
                            <div
                                key={cell.key}
                                className={`${styles.cell} ${styles.emptyCell}`}
                                aria-hidden="true"
                            />
                        );
                    }

                    const hasIntervention = cell.interventions.length > 0;
                    const className = [
                        styles.cell,
                        cell.isToday ? styles.today : '',
                        hasIntervention ? styles.withIntervention : '',
                        hasIntervention ? styles.clickableCell : '',
                    ]
                        .filter(Boolean)
                        .join(' ');

                    return (
                        <button
                            key={cell.key}
                            type="button"
                            className={className}
                            onClick={() => {
                                if (!cell.dayNumber || !hasIntervention) {
                                    return;
                                }
                                handleOpenDayModal(cell.dayNumber, cell.interventions);
                            }}
                            disabled={!hasIntervention}
                        >
                            {hasIntervention && (
                                <Image
                                    src="/images/icons/historique-dark-on-green.svg"
                                    alt=""
                                    width={32}
                                    height={32}
                                />
                            )}

                            <span className={styles.dayNumber}>
                                {cell.dayNumber}
                            </span>
                        </button>
                    );
                })}
            </div>
        </section>
    );
}

function buildDateKey(year: number, month: number, day: number): string {
    const safeMonth = String(month + 1).padStart(2, '0');
    const safeDay = String(day).padStart(2, '0');
    return `${year}-${safeMonth}-${safeDay}`;
}

function capitalize(value: string): string {
    if (!value) {
        return value;
    }

    return value.charAt(0).toUpperCase() + value.slice(1);
}