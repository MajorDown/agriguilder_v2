'use client';
import { ChangeEvent } from "react";
import styles from "@/styles/components/application/ui/inputs/appDateInput.module.css";

export type AppDateInputProps = {
    value: string;
    onChange: (value: string) => void;
    maxDaysPast: number;
    label?: string;
    name?: string;
    disabled?: boolean;
    required?: boolean;
};

function formatDateToInputValue(date: Date): string {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function getMinDate(maxDaysPast: number): string {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - maxDaysPast);

    return formatDateToInputValue(date);
}

function getMaxDate(): string {
    const date = new Date();
    date.setHours(0, 0, 0, 0);

    return formatDateToInputValue(date);
}

export default function AppDateInput(props: AppDateInputProps) {
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        props.onChange(event.target.value);
    };

    const minDate = getMinDate(props.maxDaysPast);
    const maxDate = getMaxDate();

    return (
        <div className={styles.container}>
            {props.label && (
                <label htmlFor={props.name}>
                    {props.label}
                </label>
            )}
            <input
                type="date"
                name={props.name}
                value={props.value}
                onChange={handleChange}
                min={minDate}
                max={maxDate}
                disabled={props.disabled}
                required={props.required}
            />
        </div>
    );
}