import map from 'lodash/map';
import forEach from 'lodash/forEach';
import indexOf from 'lodash/indexOf';

import getMonthNames from '../month-names';


function getMonthNamePattern(format = 'short', locale = 'en-us') {
    const monthsList = getMonthNames(format, locale);
    const pattern = monthsList.join('|');
    return `\\b(?:${pattern}|${pattern.toLowerCase()})(?!\\w)`;
}

function getRegularExpressions(locale = 'en-us') {
    return {
        dd: '(0?[1-9]|1[0-9]|2[0-9]|3[01])(?!\\d)',
        d: '([1-9]|1[0-9]|2[0-9]|3[01])(?!\\d)',
        // shorthand expression for month, but not working in this case -> '\\b(?:jan(?:uary)?|feb(?:ruary)?|...|dec(?:ember)?)',
        mmmm: getMonthNamePattern('long', locale),
        mmm: getMonthNamePattern('short', locale),
        mm: '(0?[1-9]|1[012])(?!\\d)',
        m: '([1-9][012]?)(?!\\d)',
        yyyy: '\\d{4}(?!\\d)',
        yy: '\\d{2}(?!\\d)'
    };
}

let DEFAULT_LOCALE = 'en-us';
let regularExpressions = getRegularExpressions();
let shortMonthNames = getMonthNames('short');
let longMonthNames = getMonthNames('long');

function getFormatMatches(dateFormat = 'mm/dd/yyyy') {
    const formatRegStringArray = map(regularExpressions, (expression, formatKey) => {
        return `\\b(${formatKey})((?=\\/|\\-|\\ |\\.)|$)`;
    });

    const reg = new RegExp(formatRegStringArray.join('|'), 'mg');

    return dateFormat.toLocaleLowerCase().match(reg);
}

function getParts(matches, dateValue) {
    const regStringArray = map(matches, (matchString, index) => {
        if (index === 0) return `(?<!\\w|\\/|\\-|\\ |\\.)(${regularExpressions[matchString]})(?=\\/|\\-|\\ |\\.)`;
        if (index === 1) return `(?<=\\/|\\-|\\ |\\.)(${regularExpressions[matchString]})(?=\\/|\\-|\\ |\\.)`;
        if (index === 2) return `(?<=\\/|\\-|\\ |\\.)(${regularExpressions[matchString]})(?=$)`;
        return '';
    });

    const parts = {};
    forEach(matches, (matchString, index) => {
        const match = dateValue.match(new RegExp(regStringArray[index], 'mg'));
        switch (matchString) {
        case 'd':
        case 'dd':
            parts.day = match ? Number.parseInt(match[0], 10) : null;
            break;
        case 'm':
        case 'mm':
            parts.month = match ? Number.parseInt(match[0], 10) : null;
            break;
        case 'mmm':
            parts.month = match ? indexOf(shortMonthNames, match[0].toLowerCase()) : null;
            break;
        case 'mmmm':
            parts.month = match ? indexOf(longMonthNames, match[0].toLowerCase()) : null;
            break;
        case 'yy':
        case 'yyyy':
            parts.year = match ? Number.parseInt(match[0], 10) : null;
            break;
        default:
        }
    });
    return parts;
}

export default function dateParts(dateValue, dateFormat = 'mm/dd/yyyy', locale = 'en-us') {
    if (DEFAULT_LOCALE !== locale) {
        DEFAULT_LOCALE = locale;
        regularExpressions = getRegularExpressions(locale);
        shortMonthNames = getMonthNames('short', locale);
        longMonthNames = getMonthNames('long', locale);
    }

    const matches = getFormatMatches(dateFormat);
    return getParts(matches, dateValue);
}

