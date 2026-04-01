"use client";

import { useId, useState } from "react";
import styles from "@/styles/components/application/ui/inputs/appInput.module.css";

export type AppInputType = "text" | "password" | "email" | "tel" | "number";

export type AppInputProps = {
    label: string;
    type: AppInputType;
    value: string;
    onChange: (newValue: string) => void;

    id?: string;
    name?: string;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    error?: string | null;
    hint?: string;
    autoComplete?: string;

    min?: number;
    max?: number;
    step?: number;

    pattern?: string;
    showTogglePassword?: boolean;
};

export default function AppInput(props: AppInputProps) {
    const generatedId = useId();
    const inputId = props.id ?? generatedId;

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const computedType =
        props.type === "password"
            ? isPasswordVisible
                ? "text"
                : "password"
            : props.type;

    const hasPasswordToggle =
        props.type === "password" && props.showTogglePassword !== false;

    return (
        <div className={styles.inputWrapper}>
            <label htmlFor={inputId} className={styles.label}>
                {props.label}
            </label>

            <div className={styles.inputContainer}>
                <input
                    id={inputId}
                    name={props.name}
                    type={computedType}
                    value={props.value}
                    onChange={(e) => props.onChange(e.target.value)}
                    placeholder={props.placeholder}
                    disabled={props.disabled}
                    required={props.required}
                    autoComplete={props.autoComplete}
                    className={`${styles.appInput} ${props.error ? styles.errorInput : ""}`}
                    min={props.type === "number" ? props.min : undefined}
                    max={props.type === "number" ? props.max : undefined}
                    step={props.type === "number" ? props.step : undefined}
                    pattern={props.pattern}
                />

                {hasPasswordToggle && (
                    <button
                        type="button"
                        className={styles.toggleButton}
                        onClick={() => setIsPasswordVisible((prev) => !prev)}
                        aria-label={
                            isPasswordVisible
                                ? "Masquer le mot de passe"
                                : "Afficher le mot de passe"
                        }
                    >
                        {isPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                )}
            </div>

            {props.hint && !props.error && (
                <small className={styles.hint}>{props.hint}</small>
            )}

            {props.error && (
                <small className={styles.errorText}>{props.error}</small>
            )}
        </div>
    );
}

const EyeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#3b574d"
    strokeWidth="2"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#3b574d"
    strokeWidth="2"
  >
    <path d="M17.94 17.94A10.94 10.94 0 0112 20C5 20 1 12 1 12a21.77 21.77 0 015.06-7.94" />
    <path d="M9.9 4.24A10.94 10.94 0 0112 4c7 0 11 8 11 8a21.77 21.77 0 01-2.06 3.34" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);