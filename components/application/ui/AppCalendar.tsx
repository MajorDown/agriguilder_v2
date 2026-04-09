'use client';

import { useMemo, useState } from 'react';
import styles from '@/styles/components/application/ui/appCalendar.module.css';
import Image from 'next/image';

export type CalendarIntervention = {
    id: string;
    day: Date | string;
};

export type AppCalendarProps = {
    initialMonth: number; // 0 = janvier, 11 = décembre
    initialYear: number;
    interventions: CalendarIntervention[];
};

type CalendarCell = {
    key: string;
    dayNumber?: number;
    hasIntervention: boolean;
    isEmpty: boolean;
    isToday: boolean;
};

const WEEK_DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

export default function AppCalendar(props: AppCalendarProps) {
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

    const interventionDaysSet = useMemo(() => {
        const result = new Set<string>();
        for (const intervention of props.interventions) {
            const date = new Date(intervention.day);

            const key = buildDateKey(
                date.getFullYear(),
                date.getMonth(),
                date.getDate()
            );
            result.add(key);
        }
        return result;
    }, [props.interventions]);

    const cells = useMemo((): CalendarCell[] => {
        const result: CalendarCell[] = [];
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        // JS : dimanche = 0, lundi = 1, ..., samedi = 6
        // On veut : lundi = 0, ..., dimanche = 6
        const jsDay = firstDayOfMonth.getDay();
        const firstDayIndex = jsDay === 0 ? 6 : jsDay - 1;
        for (let i = 0; i < firstDayIndex; i++) {
            result.push({
                key: `empty-${currentYear}-${currentMonth}-${i}`,
                isEmpty: true,
                hasIntervention: false,
                isToday: false,
            });
        }
        for (let day = 1; day <= daysInMonth; day++) {
            const key = buildDateKey(currentYear, currentMonth, day);
            result.push({
                key,
                dayNumber: day,
                isEmpty: false,
                hasIntervention: interventionDaysSet.has(key),
                isToday: key === todayKey,
            });
        }
        return result;
    }, [currentMonth, currentYear, interventionDaysSet, todayKey]);

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
                    const className = [
                        styles.cell,
                        cell.isToday ? styles.today : '',
                        cell.hasIntervention ? styles.withIntervention : '',
                    ]
                        .filter(Boolean)
                        .join(' ');
                    return (
                        <div
                            key={cell.key}
                            className={className}
                        >
                            {cell.hasIntervention && (<Image
                                    src="/images/icons/historique-dark-on-green.svg"
                                    alt=""
                                    width={32}
                                    height={32}
                                />
                            )}                            
                            <span className={styles.dayNumber}>
                                {cell.dayNumber}
                            </span>
                        </div>
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