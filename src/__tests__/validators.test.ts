import {
    requireValidator,
    maxLengthValidator,
    minLengthValidator,
    regExpValidator,
    emailValidator,
} from '../validators';

describe('validator tests', () => {
    const err = 'error text';

    describe('requireValidator', () => {
        it.each([
            ['val', '', true],
            ['', err, true],
            [undefined, err, true],
            [null, err, true],
            [5, '', true],
            [0, '', true],
            [0, err, false],
        ])('requireValidator(%s, %s, %s)', (value, result, allowZero) => {
            const fn = requireValidator(err, allowZero);
            expect(fn(value as string)).toBe(result);
        });
    });

    describe('maxLengthValidator', () => {
        it.each([
            [5, 'val', ''],
            [5, 'value long', err],
            [5, 3, ''],
            [5, 6, err],
        ])('maxLengthValidator(%s, %s, %s)', (max, value, result) => {
            const fn = maxLengthValidator(max, err);
            expect(fn(value)).toBe(result);
        });
    });

    describe('minLengthValidator', () => {
        it.each([
            [1, 'val', ''],
            [5, 'val', err],
            [1, 3, ''],
            [5, 4, err],
        ])('minLengthValidator(%s, %s, %s)', (min, value, result) => {
            const fn = minLengthValidator(min, err);
            expect(fn(value)).toBe(result);
        });
    });

    describe('regExpValidator', () => {
        it.each([
            [/^[0-9]+$/, '987', ''],
            [/^[0-9]+$/, '987g', err],
            [/^[0-9]+$/, '', err],
        ])('regExpValidator(%s, %s, %s)', (regExp, value, result) => {
            const fn = regExpValidator(regExp, err);
            expect(fn(value)).toBe(result);
        });
    });

    describe('emailValidator', () => {
        it.each([
            ['test@gmail.com', ''],
            ['test@gmail', err],
            ['test@', err],
            ['test', err],
            ['test@23.45', err],
            ['@gmail.com', err],
        ])('emailValidator(%s, %s, %s)', (value, result) => {
            const fn = emailValidator(err);
            expect(fn(value)).toBe(result);
        });
    });
});
