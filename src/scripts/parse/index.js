import indexOf from 'lodash/indexOf';
import map from 'lodash/map';
import forEach from 'lodash/forEach';
import includes from 'lodash/includes';

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

export default function parse(dateValue, dateFormat = 'mm/dd/yyyy', locale = 'en-us') {
    if (DEFAULT_LOCALE !== locale) {
        DEFAULT_LOCALE = locale;
        regularExpressions = getRegularExpressions(locale);
    }

    const shortMonthNames = getMonthNames('short', locale);
    const longMonthNames = getMonthNames('long', locale);

    const formatRegStringArray = map(regularExpressions, (expression, formatKey) => {
        return `(${formatKey})((?=\\/|\\-|\\ |\\.)|$)`;
    });

    const formatReg = new RegExp(formatRegStringArray.join('|'), 'mg');

    const matches = dateFormat.toLocaleLowerCase().match(formatReg);

    const regStringArray = map(matches, (matchString) => {
        return regularExpressions[matchString];
    });

    const reg = new RegExp(regStringArray.join('|'), 'mg');

    const dateParts = dateValue.toLocaleLowerCase().match(reg);

    const date = new Date();

    forEach(matches, (matchString, index) => {
        if (includes(['d', 'dd'], matchString)) date.setDate(dateParts[index]);
        if (includes(['m', 'mm'], matchString)) date.setMonth(dateParts[index] - 1);
        if (includes(['mmm'], matchString)) date.setMonth(indexOf(shortMonthNames, dateParts[index].toLowerCase()));
        if (includes(['mmmm'], matchString)) date.setMonth(indexOf(longMonthNames, dateParts[index].toLowerCase()));
        if (includes(['yy', 'yyyy'], matchString)) date.setYear(dateParts[index]);
    });
    return date;
}


//   getMonthNames('de');

//   parse('December/22/1971'); // Error because default format is mm/dd/yyyy
//   parse('December/22/1972','mmm/dd/yyyy')
//   parse('22/03/1973','dd/mm/yyyy')
//   parse('december 23 1974','mmmddyyyy')
//   parse('märz 20 1975','mmmddyyyy','de')
//   parse('21 märz 1976','ddmmmyyyy','de')
//   parse('22/märz/1977','dd/mmm/yyyy','de')
//   parse('23-märz-1978','dd-mmm-yyyy','de')
//   parse('23-märz-1986','dd-mmm-yyyy','de')

//   let s = new RegExp('([0-9]{2})(?=\\/|-|\\ |\\.|.)([^\\s(?=\\/|\\-|\\ |\\.|.)])');
//   s.exec('23-märz-1986')
//   '23-märz-1986'.replace(new RegExp('([0-9]{2})([\\/|\\-|\\ |\\.|.])*'), '')
//   s = new RegExp('([^\\/\\-\\ \\.0-9])+', 'mg');
//   'märz-1986'.match(s)
//   'märz-1986'.replace(new RegExp('([0-9]{2})([\\/|\\-|\\ |\\.|.])*'), '')

