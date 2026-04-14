'use client';
import { useEffect, useState } from "react";
import styles from "@/styles/components/application/ui/inputs/appDurationInput.module.css";


export type AppDurationInputProps = {
    value?: number; // valeur décimale (ex: 1.5)
    onChange: (value: number) => void;
    maxHours?: number;
    minuteStep?: 1 | 5 | 10 | 15 | 30;
    label?: string;
};

function decimalToParts(value: number) {
    const hours = Math.floor(value);
    const minutes = Math.round((value - hours) * 60);
    return { hours, minutes };
}

function partsToDecimal(hours: number, minutes: number) {
    return hours + minutes / 60;
}

export default function AppDurationInput(props: AppDurationInputProps) {
    const {
        value = 0,
        onChange,
        maxHours = 24,
        minuteStep = 15,
        label,
    } = props;

    const initial = decimalToParts(value);

    const [hours, setHours] = useState(initial.hours);
    const [minutes, setMinutes] = useState(initial.minutes);

    // sync si value change depuis l'extérieur
    useEffect(() => {
        const { hours, minutes } = decimalToParts(value);
        setHours(hours);
        setMinutes(minutes);
    }, [value]);

    // update parent
    useEffect(() => {
        onChange(partsToDecimal(hours, minutes));
    }, [hours, minutes]);

    const hourOptions = Array.from({ length: maxHours + 1 }, (_, i) => i);

    const minuteOptions = [];
    for (let i = 0; i < 60; i += minuteStep) {
        minuteOptions.push(i);
    }

    return (
        <div className={styles.container}>
            {label && <label>{label}</label>}

            <div className={styles.selectLine}>
                <select
                    value={hours}
                    onChange={(e) => setHours(Number(e.target.value))}
                >
                    {hourOptions.map((h) => (
                        <option key={h} value={h}>
                            {h}h
                        </option>
                    ))}
                </select>

                <select
                    value={minutes}
                    onChange={(e) => setMinutes(Number(e.target.value))}
                >
                    {minuteOptions.map((m) => (
                        <option key={m} value={m}>
                            {m.toString().padStart(2, "0")} min
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}