![Main branch tests status](https://github.com/PetrivskyiTaras/use-model-validator/actions/workflows/tests.yml/badge.svg?branch=main)
![Coverage Badge](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/PetrivskyiTaras/19ff0745002cd9d7962345032e687efb/raw/use-model-validator__heads_main.json)
![Coverage Badge](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/PetrivskyiTaras/19ff0745002cd9d7962345032e687efb/raw/use-model-validator__pull_5.json)


## Simple model validator
`useModelValidator` is a TypeScript-friendly React hook for simple validation.

## Install
- `npm install use-model-validator` or
- `yarn add use-model-validator`

## Hook variables
- **`values`** - object with all values;
- **`errors`** - object with errors;
- **`validate`** - validation function `() => boolean`, set errors if exist;
- **`onValueChange`** - function to set and validate value `(name: keyof ValidationSchema, value: SupportedValidationTypes) => void`;
- **`onValuesChange`** - function to set and validate multiple values `(model: Partial<ValidationSchema>) => void`;
- **`reset`** - reset values and errors to initial data;
- **`setInitialValues`** - set initial values function `(model: Partial<ValidationSchema>) => void`;
- **`setValueSilent`** - set value without validation `(name: keyof ValidationSchema, value: SupportedValidationTypes) => void`;
- **`setValuesSilent`** - set multiple values without validation `(model: Partial<ValidationSchema>) => void`;
- **`isValid`** - flag to indicate if Validation Schema is valid, at the beginning initialize as `true` until the first error occurred.

## Supported Field Value Types (SupportedValidationTypes)
- string
- boolean
- number
- undefined
- null

(plan to make wider this list)

## Usage
```jsx harmony
import React from 'react';
import useModelValidator, { SupportedValidationTypes, Rules } from 'use-model-validator';

interface FormData {
    name: string;
    code: number;
    isActive: boolean;
}

// type for validation schema
interface ValidationSchema extends FormData {
    [key: string]: SupportedValidationTypes;
}

const App: React.FC = () => {
    // initialize default values
    const defaultValues: ValidationSchema = {
        name: '',
        code: 0,
        isActive: false,
    };

    // max length validator, you can create your own validators as much as you need
    // it is should be a function that returns a function (ValidationFunction type)
    const maxLengthValidator = (max: number, errorText: string) => (value: string | number): string => {
        if (typeof value === 'number') {
            return value > max ? errorText : '';
        }
        return (value || '').length > max ? errorText : '';
    };

    const rules: Rules<ValidationSchema> = {
        name: [maxLengthValidator(3, 'Invalid name')],
        code: [maxLengthValidator(10, 'Invalid code')],
    };
    const { values, onValueChange, errors, validate, isValid } = useModelValidator<ValidationSchema>(defaultValues, rules);

    const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
        onValueChange('name', e.target.value);
    };

    const onChangeCode = (e: React.ChangeEvent<HTMLInputElement>) => {
        onValueChange('code', +e.target.value);
    };

    const onChangeIsActive = (e: React.ChangeEvent<HTMLInputElement>) => {
        onValueChange('isActive', e.target.checked);
    };

    const onSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        const isFormValid = validate();
        if (isFormValid) {
            // send request to server
            console.table(values);
        } else {
            console.table(errors);
        }
    };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input type="text" value={values.name} onChange={onChangeName}/>
        {!!errors.name && <span style={{color: 'red'}}>{errors.name}</span>}
        <input type="number" value={values.code} onChange={onChangeCode}/>
        {!!errors.code && <span style={{color: 'red'}}>{errors.code}</span>}
        <input type="checkbox" checked={values.isActive} onChange={onChangeIsActive}/>
        <input type="submit" value="Submit form" disabled={!isValid} />
      </form>
    </div>
  );
}

export default App;
```

## Multiple Values Change Usage
```jsx harmony
import React from 'react';
import useModelValidator, { SupportedValidationTypes, Rules } from 'use-model-validator';

interface FormData {
    name: string;
    code: string;
}

interface ValidationSchema extends FormData {
    [key: string]: SupportedValidationTypes;
}

const MultipleValuesApp: React.FC = () => {
    const defaultValues: ValidationSchema = {
        name: '', // User Name
        code: '', // UN
    };

    const rules: Rules<ValidationSchema> = {
        name: [maxLengthValidator(255, 'Invalid name')],
        code: [maxLengthValidator(3, 'Invalid code')],
    };
    const { values, onValueChange, onValuesChange, errors, validate } = useModelValidator<ValidationSchema>(defaultValues, rules);

    const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        // set multiple values
        onValuesChange({
            name: val,
            code: val.split(' ').map((item: string) => item.charAt(0)).join('').toUpperCase(),
        });
    };

    const onChangeCode = (e: React.ChangeEvent<HTMLInputElement>) => {
        onValueChange('code', +e.target.value);
    };

    const onSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        const isFormValid = validate();
        if (isFormValid) {
            // send request to server
        }
    };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input type="text" value={values.name} onChange={onChangeName}/>
        {!!errors.name && <span style={{color: 'red'}}>{errors.name}</span>}
        <input type="text" value={values.code} onChange={onChangeCode}/>
        {!!errors.code && <span style={{color: 'red'}}>{errors.code}</span>}
        <input type="submit" value="Submit form" disabled={!isValid} />
      </form>
    </div>
  );
}

export default MultipleValuesApp;
```

## Validators
You can use some predefined validators:
- **requireValidator** `(errorText: string, allowZero = true) => (value: string | number): string`;
- **maxLengthValidator** `(max: number, errorText: string) => (value: string | number): string`;
- **minLengthValidator** `(min: number, errorText: string) => (value: string | number): string`;
- **regExpValidator** `(regx: RegExp, errorText: string) => (value: string): string`;
- **emailValidator** `(errorText: string) => (value: string): string`;

### Validators Import
```javascript
import { requireValidator } from 'use-model-validator';
```
