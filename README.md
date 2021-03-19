# use-model-validator

## Simple model validator
`useModelValidator` is a TypeScript-friendly React hook for validation.

## Install
- `npm install use-model-validator` or
- `yarn add use-model-validator`

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
 
 function App() {
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
         name: [maxLengthValidator(3, 'Invalid name')] as any,
         code: [maxLengthValidator(10, 'Invalid code')] as any,
     };
     const { values, isValid, onValueChange, errors } = useModelValidator<ValidationSchema>(defaultValues, rules);
 
     const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
         onValueChange('name', e.target.value);
     };
 
     const onChangeCode = (e: React.ChangeEvent<HTMLInputElement>) => {
         onValueChange('code', +e.target.value);
     };
 
     const onSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
         e.preventDefault();
         if (isValid) {
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
         <input type="submit" value="Submit form" />
       </form>
     </div>
   );
 }
 
 export default App;
```
