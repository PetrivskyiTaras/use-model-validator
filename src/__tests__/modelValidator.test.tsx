import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import App, { ValidationSchema } from '../__mock__/App';

describe('useModelValidator tests', () => {
    let callback: (val: ValidationSchema | boolean) => void;

    beforeEach(() => {
        callback = jest.fn();
    });

    it('should render', () => {
        const { getByRole } = render(<App callback={callback} />);
        expect(getByRole('form')).toBeDefined();
    });

    it('should not submit form if form is not valid', () => {
        const { queryByTestId, getByRole } = render(<App callback={callback} />);

        expect(queryByTestId('form-errors')).toBeNull();
        // name is empty by default and it is required
        fireEvent.submit(getByRole('form'));

        // form errors are displayed
        expect(queryByTestId('form-errors')).not.toBeNull();
        // form is still here
        expect(getByRole('form')).toBeDefined();
        expect(callback).toHaveBeenCalledWith(false);
    });

    it('should submit form if form is valid', () => {
        const { getByRole, queryByTestId } = render(<App callback={callback} />);

        fireEvent.change(getByRole('name'), { target: { value: 'name' } });

        fireEvent.submit(getByRole('form'));

        // form is not here
        expect(queryByTestId('form')).toBeNull();
        expect(callback).toHaveBeenCalledWith({
            name: 'name',
            code: 1,
            isActive: false,
        });
    });

    it('should correct validate name', () => {
        const { queryByTestId, getByRole } = render(<App callback={callback} />);

        // errors are not display when field is not touched
        expect(queryByTestId('name-error')).toBeNull();

        // maxLengthValidator
        fireEvent.change(getByRole('name'), { target: { value: 'long name with more than 5 symbols' } });
        expect(queryByTestId('name-error')).not.toBeNull();

        // requireValidator
        fireEvent.change(getByRole('name'), { target: { value: '' } });
        expect(queryByTestId('name-error')).not.toBeNull();

        // correct value
        fireEvent.change(getByRole('name'), { target: { value: 'name' } });
        expect(queryByTestId('name-error')).toBeNull();
    });

    it('should reset values', () => {
        const { getByRole } = render(<App callback={callback} />);

        fireEvent.change(getByRole('name'), { target: { value: 'name' } });
        fireEvent.change(getByRole('code'), { target: { value: 3 } });
        fireEvent.change(getByRole('is-active'), { target: { checked: true } });

        expect(getByRole('name').closest('input')?.value).toBe('name');
        expect(getByRole('code').closest('input')?.value).toBe('3');
        expect(getByRole('is-active').closest('input')?.checked).toBeTruthy();

        fireEvent.click(getByRole('reset-button'));

        expect(getByRole('name').closest('input')?.value).toBe('');
        expect(getByRole('code').closest('input')?.value).toBe('1');
        expect(getByRole('is-active').closest('input')?.checked).toBeFalsy();
    });

    it('should set value silent', () => {
        const { queryByTestId, getByRole } = render(<App callback={callback} />);

        expect(queryByTestId('name-error')).toBeNull();

        fireEvent.click(getByRole('set-name-silent'));
        // error is not appeared
        expect(queryByTestId('name-error')).toBeNull();
    });

    it('should set incorrect value silent but validate form is correct', () => {
        const { queryByTestId, getByRole } = render(<App callback={callback} />);

        expect(queryByTestId('name-error')).toBeNull();
        expect(queryByTestId('form-errors')).toBeNull();

        fireEvent.click(getByRole('set-name-silent'));
        // error is not appeared
        expect(queryByTestId('name-error')).toBeNull();

        fireEvent.submit(getByRole('form'));

        expect(queryByTestId('form-errors')).not.toBeNull();
        expect(getByRole('form')).toBeDefined();
        expect(callback).toHaveBeenCalledWith(false);
    });

    it('should set valid multiple values name and code and submit form', () => {
        const { queryByTestId, getByRole } = render(<App callback={callback} />);

        expect(queryByTestId('name-error')).toBeNull();
        expect(queryByTestId('code-error')).toBeNull();
        expect(queryByTestId('form-errors')).toBeNull();

        fireEvent.click(getByRole('set-valid-name-and-code'));
        // errors is not appeared
        expect(queryByTestId('name-error')).toBeNull();
        expect(queryByTestId('code-error')).toBeNull();
        expect(queryByTestId('form-errors')).toBeNull();

        fireEvent.submit(getByRole('form'));

        expect(queryByTestId('form-errors')).toBeNull();
        expect(queryByTestId('form')).toBeNull();
    });

    it('should set invalid multiple values name and code and do not submit form', () => {
        const { queryByTestId, getByRole } = render(<App callback={callback} />);

        expect(queryByTestId('name-error')).toBeNull();
        expect(queryByTestId('code-error')).toBeNull();
        expect(queryByTestId('form-errors')).toBeNull();

        fireEvent.click(getByRole('set-invalid-name-and-code'));
        // errors appeared
        expect(queryByTestId('name-error')).not.toBeNull();
        expect(queryByTestId('code-error')).not.toBeNull();
        expect(queryByTestId('form-errors')).not.toBeNull();

        fireEvent.submit(getByRole('form'));

        expect(queryByTestId('form-errors')).not.toBeNull();
        expect(getByRole('form')).toBeDefined();
        expect(callback).toHaveBeenCalledWith(false);
    });

    it('should clear errors if exist on multiple values change', () => {
        const { queryByTestId, getByRole } = render(<App callback={callback} />);

        expect(queryByTestId('name-error')).toBeNull();
        expect(queryByTestId('code-error')).toBeNull();
        expect(queryByTestId('form-errors')).toBeNull();

        fireEvent.change(getByRole('name'), { target: { value: 'name long invalid name' } });
        fireEvent.change(getByRole('code'), { target: { value: 20 } });
        // errors appeared
        expect(queryByTestId('name-error')).not.toBeNull();
        expect(queryByTestId('code-error')).not.toBeNull();
        expect(queryByTestId('form-errors')).not.toBeNull();

        fireEvent.click(getByRole('set-valid-name-and-code'));

        expect(queryByTestId('name-error')).toBeNull();
        expect(queryByTestId('code-error')).toBeNull();
        expect(queryByTestId('form-errors')).toBeNull();
    });

    it('should set invalid multiple values name and code silent and do not show errors', () => {
        const { queryByTestId, getByRole } = render(<App callback={callback} />);

        expect(queryByTestId('name-error')).toBeNull();
        expect(queryByTestId('code-error')).toBeNull();
        expect(queryByTestId('form-errors')).toBeNull();

        fireEvent.click(getByRole('set-invalid-name-and-code-silent'));
        // errors not appeared
        expect(queryByTestId('name-error')).toBeNull();
        expect(queryByTestId('code-error')).toBeNull();
        expect(queryByTestId('form-errors')).toBeNull();

        fireEvent.submit(getByRole('form'));

        // errors appeared after submit
        expect(queryByTestId('name-error')).not.toBeNull();
        expect(queryByTestId('code-error')).not.toBeNull();
        expect(queryByTestId('form-errors')).not.toBeNull();
    });

    it('should correct set isValid flag if field is invalid', () => {
        const { queryByTestId, getByRole } = render(<App callback={callback} />);

        expect(getByRole('submit-button').closest('input')?.disabled).toBeFalsy();
        expect(queryByTestId('name-error')).toBeNull();

        fireEvent.change(getByRole('name'), { target: { value: 'name long invalid name' } });
        expect(queryByTestId('name-error')).not.toBeNull();
        expect(getByRole('submit-button').closest('input')?.disabled).toBeTruthy();
    });

    it('should correct set isValid flag if fields did not change', () => {
        const { queryByTestId, getByRole } = render(<App callback={callback} />);

        expect(getByRole('submit-button').closest('input')?.disabled).toBeFalsy();
        expect(queryByTestId('name-error')).toBeNull();

        fireEvent.submit(getByRole('form'));

        expect(queryByTestId('name-error')).not.toBeNull();
        expect(getByRole('submit-button').closest('input')?.disabled).toBeTruthy();
    });
});
