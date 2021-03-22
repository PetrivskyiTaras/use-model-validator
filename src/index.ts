import * as React from 'react';
import {
    requireValidator,
    maxLengthValidator,
    minLengthValidator,
    regExpValidator,
    emailValidator,
} from './validators';

export { requireValidator, maxLengthValidator, minLengthValidator, regExpValidator, emailValidator };

export type SupportedValidationTypes = string | number | undefined | boolean;

type ValidationFunction<T> =
    | ((s: SupportedValidationTypes) => string)
    | ((s: SupportedValidationTypes, values: T) => string);

type ModelType = Record<string, SupportedValidationTypes>;

interface ReturnData<T> {
    values: T;
    errors: ValidationErrors<T>;
    validate: () => boolean;
    onValueChange: (name: keyof T, value: SupportedValidationTypes) => void;
    setValueSilent: (name: keyof T, value: SupportedValidationTypes) => void;
    setInitialValues: (values: Partial<T>) => void;
    reset: () => void;
    isValid: boolean;
}

type ValidationErrors<T> = Partial<Record<keyof T, string>>;

export type Rules<T> = Partial<Record<keyof T, ValidationFunction<T>[]>>;

type KeyType<T> = keyof T & string;

const useModelValidator = <T extends ModelType>(val: T, rules: Rules<T>): ReturnData<T> => {
    const [values, setValues] = React.useState<T>(val);

    const err: ValidationErrors<T> = {};

    const [errors, setErrors] = React.useState<ValidationErrors<T>>(err);
    const [isValid, setIsValid] = React.useState(true);

    React.useEffect(() => {
        setIsValid(Object.values(errors).every((error) => !error));
    }, [errors]);

    const initialValues: T = Object.freeze({ ...val });
    const initialErrors: ValidationErrors<T> = Object.freeze({ ...err });

    const validateValue = (name: KeyType<T>, value: SupportedValidationTypes): string => {
        const validators: ValidationFunction<T>[] | undefined = rules[name];
        if (!!validators && validators.length > 0) {
            const messages = validators.map((validator) => validator(value, values)).filter((e) => !!e);
            if (messages.length > 0) {
                // display the first found error message
                return messages[0];
            }
        }
        return '';
    };

    const validate = (): boolean => {
        const validateErr: ValidationErrors<T> = {};
        Object.entries(values).forEach((arg) => {
            const key: KeyType<T> = arg[0];
            const value: SupportedValidationTypes = arg[1];
            const errorMessage = validateValue(key, value);
            if (!!errorMessage) {
                validateErr[key] = errorMessage;
            }
        });
        setErrors({
            ...errors,
            ...validateErr,
        });

        return Object.values(validateErr).every((validateErrValue: string) => !validateErrValue);
    };

    const onValueChange = (name: KeyType<T>, value: SupportedValidationTypes): void => {
        setValues((prevValues: T) => ({ ...prevValues, [name]: value }));

        const errMsg = validateValue(name, value);
        if (!!errMsg) {
            setErrors((prevErrors: ValidationErrors<T>) => {
                return { ...prevErrors, [name]: errMsg };
            });
        } else if (!!errors[name]) {
            setErrors((prevErrors: ValidationErrors<T>) => {
                return { ...prevErrors, [name]: '' };
            });
        }
    };

    const reset = (): void => {
        setValues({ ...initialValues });
        setErrors({ ...initialErrors });
    };

    const setValueSilent = (prop: KeyType<T>, value: SupportedValidationTypes): void => {
        setValues((v) => ({
            ...v,
            [prop]: value,
        }));
    };

    const setInitialValues = (model: Partial<T>): void => {
        setErrors({ ...initialErrors });
        setValues((v: T) => ({ ...v, ...model }));
    };

    return {
        values,
        errors,
        validate,
        onValueChange,
        reset,
        setInitialValues,
        setValueSilent,
        isValid,
    };
};

export default useModelValidator;
