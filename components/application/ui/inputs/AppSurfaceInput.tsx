import AppInput from "./AppInput";
import Styles from '@/styles/components/application/ui/inputs/appSurfaceInput.module.css';

export type AppSurfaceInputProps = {
    value: number;
    onChange: (value: number) => void;
    label: string;
}

export default function AppSurfaceInput(props: AppSurfaceInputProps) {
    return (
        <AppInput
            id={Styles.surfaceInput}
            type="number"
            value={props.value.toString()}
            onChange={(newValue) => {
                const parsedValue = parseFloat(newValue);
                if (!isNaN(parsedValue)) {
                    props.onChange(parsedValue);
                }
            }}
            label={props.label}
        />
    );
}