import React, { useState } from 'react';
import useModelValidator, { SupportedValidationTypes, Rules, maxLengthValidator, requireValidator } from '../index';

interface FormData {
    name: string;
    code: number;
    isActive: boolean;
}

export interface ValidationSchema extends FormData {
    [key: string]: SupportedValidationTypes;
}

interface Props {
    callback: (val: ValidationSchema | boolean) => void;
}

const App: React.FC<Props> = ({ callback }) => {
    const defaultValues: ValidationSchema = {
        name: '',
        code: 1,
        isActive: false,
    };

    const rules: Rules<ValidationSchema> = {
        name: [maxLengthValidator(5, 'Invalid name'), requireValidator('Name is require')],
        code: [maxLengthValidator(10, 'Invalid code')],
    };
    const [submitted, setSubmitted] = useState(false);
    const { values, onValueChange, errors, validate, reset, setValueSilent } = useModelValidator<ValidationSchema>(
        defaultValues,
        rules
    );

    const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
        onValueChange('name', e.target.value);
    };

    const onChangeCode = (e: React.ChangeEvent<HTMLInputElement>) => {
        onValueChange('code', +e.target.value);
    };

    const onChangeIsActive = (e: React.ChangeEvent<HTMLInputElement>) => {
        onValueChange('isActive', e.target.checked);
    };

    const setNameSilent = () => {
        setValueSilent('name', 'incorrect long value');
    };

    const onSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        const isFormValid = validate();
        if (isFormValid) {
            setSubmitted(true);
            callback(values);
        } else {
            callback(isFormValid);
        }
    };
    return (
        <div>
            {!submitted && (
                <form role="form" onSubmit={onSubmit} data-testid="form">
                    <input role="name" type="text" value={values.name} onChange={onChangeName} />
                    {!!errors.name && (
                        <span data-testid="name-error" style={{ color: 'red' }}>
                            {errors.name}
                        </span>
                    )}
                    <input role="code" data-testid="code" type="number" value={values.code} onChange={onChangeCode} />
                    {!!errors.code && (
                        <span data-testid="code-error" style={{ color: 'red' }}>
                            {errors.code}
                        </span>
                    )}
                    <input role="is-active" type="checkbox" checked={values.isActive} onChange={onChangeIsActive} />
                    <input type="submit" value="Submit form" />
                    {(!!errors.code || !!errors.name) && (
                        <span role="form-errors" data-testid="form-errors">
                            {'From is not valid'}
                        </span>
                    )}
                </form>
            )}
            {submitted && <h1>{'Form is submitted, please reload the page'}</h1>}
            <button role="reset-button" onClick={reset} value="Reset values" />
            <button role="set-name-silent" onClick={setNameSilent} value="Reset values" />
        </div>
    );
};

export default App;
