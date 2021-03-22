export const requireValidator = (errorText: string, allowZero = true) => (value: string | number): string => {
    return typeof value === 'undefined' || value === '' || value === null || (!allowZero && value === 0)
        ? errorText
        : '';
};

export const maxLengthValidator = (max: number, errorText: string) => (value: string | number): string => {
    if (typeof value === 'number') {
        return value > max ? errorText : '';
    }
    return (value || '').length > max ? errorText : '';
};

export const minLengthValidator = (min: number, errorText: string) => (value: string | number): string => {
    if (typeof value === 'number') {
        return value < min ? errorText : '';
    }
    return (value || '').length < min ? errorText : '';
};

export const regExpValidator = (regx: RegExp, errorText: string) => (value: string): string => {
    const arr = value.match(regx);
    return !!arr && arr.length > 0 ? '' : errorText;
};

export const emailValidator = (errorText: string) => (email: string): string => {
    return !/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g.test(
        email
    ) && email
        ? errorText
        : '';
};
