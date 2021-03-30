import * as React from 'react';
import {
    requireValidator,
    maxLengthValidator,
    minLengthValidator,
    regExpValidator,
    emailValidator,
} from './validators';

export { requireValidator, maxLengthValidator, minLengthValidator, regExpValidator, emailValidator };

export type SupportedValidationTypes = string | number | undefined | boolean | null;

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
    onValuesChange: (model: Partial<T>) => void;
    setValuesSilent: (model: Partial<T>) => void;
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

    const _validateValue = (name: KeyType<T>, value: SupportedValidationTypes): string => {
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

    const _getValidateDataErrors = (validateData: Partial<T>): ValidationErrors<T> => {
        const validateErr: ValidationErrors<T> = {};
        Object.entries(validateData).forEach((arg) => {
            const key: KeyType<T> = arg[0];
            const value: SupportedValidationTypes = arg[1];
            validateErr[key] = _validateValue(key, value);
        });
        return validateErr;
    };

    const validate = (): boolean => {
        const validateErr: ValidationErrors<T> = _getValidateDataErrors(values);
        setErrors((prevErrors: ValidationErrors<T>) => {
            return { ...prevErrors, ...validateErr };
        });

        return Object.values(validateErr).every((validateErrValue: string) => !validateErrValue);
    };

    const onValueChange = (name: KeyType<T>, value: SupportedValidationTypes): void => {
        setValues((prevValues: T) => ({ ...prevValues, [name]: value }));

        setErrors((prevErrors: ValidationErrors<T>) => {
            return { ...prevErrors, [name]: _validateValue(name, value) };
        });
    };

    const onValuesChange = (model: Partial<T>): void => {
        setValues((prevValues: T) => ({ ...prevValues, ...model }));

        setErrors((prevErrors: ValidationErrors<T>) => {
            return { ...prevErrors, ..._getValidateDataErrors(model) };
        });
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

    const setValuesSilent = (model: Partial<T>): void => {
        setValues((v) => ({
            ...v,
            ...model,
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
        onValuesChange,
        setValuesSilent,
    };
};

export default useModelValidator;
