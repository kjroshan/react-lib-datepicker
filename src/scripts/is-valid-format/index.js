import map from 'lodash/map';
import forEach from 'lodash/forEach';

import getMonthNames from '../month-names';

function getMonthNamePattern(format = 'short', locale = 'en-us') {
    const monthsList = getMonthNames(format, locale);
    const pattern = `\\b(?:${monthsList.join('|')})(?!\\w)`;
    return pattern.toLowerCase();
}

function getRegularExpressions(locale = 'en-us') {
    return {
        dd: '\\b(0?[1-9]|1[0-9]|2[0-9]|3[01])(?!\\d)',
        d: '\\b([1-9]|1[0-9]|2[0-9]|3[01])(?!\\d)',
        // shorthand expression for month, but not working in this case -> '\\b(?:jan(?:uary)?|feb(?:ruary)?|...|dec(?:ember)?)',
        mmmm: getMonthNamePattern('long', locale),
        mmm: getMonthNamePattern('short', locale),
        mm: '\\b(0?[1-9]|1[012])(?!\\d)',
        m: '\\b([1-9][012]?)(?!\\d)',
        yyyy: '\\b\\d{4}(?!\\d)',
        yy: '\\b\\d{2}(?!\\d)'
    };
}

let DEFAULT_LOCALE = 'en-us';
let regularExpressions = getRegularExpressions();

export default function isValidFormat(dateValue, dateFormat, locale = 'en-us') {
    if (DEFAULT_LOCALE !== locale) {
        DEFAULT_LOCALE = locale;
        regularExpressions = getRegularExpressions(locale);
    }

    const regStringArray = map(regularExpressions, (expression, formatKey) => {
        return `(${formatKey})((?=\\/|\\-|\\ |\\.)|$)`;
    });
    const reg = new RegExp(regStringArray.join('|'), 'mg');
    const matches = dateFormat.toLocaleLowerCase().match(reg);

    let postfixChar;
    let pattern = '';
    forEach(matches, (matchString) => {
        postfixChar = dateFormat.toLocaleLowerCase().match(new RegExp(`(?<=${matchString})(\\/|\\ |\\-|\\.)`, 'mg'));
        pattern = pattern + regularExpressions[matchString] + (postfixChar ? postfixChar[0] : '');
    });
    return new RegExp(`^${pattern}$`).test(dateValue.toLowerCase());
}

