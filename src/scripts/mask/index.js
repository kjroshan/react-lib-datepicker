import take from 'lodash/take';
import times from 'lodash/times';
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
        dd: '\\b([4-9]|0[1-9]|1[0-9]|2[0-9]|3[01])(?!\\d)',
        d: '\\b([4-9]|1[0-9]|2[0-9]|3[01])(?!\\d)',
        mmmm: getMonthNamePattern('long', locale),
        mmm: getMonthNamePattern('short', locale),
        mm: '\\b([2-9]|0[1-9]|1[012])(?!\\d)',
        m: '\\b([2-9]|1[012]?)(?!\\d)',
        yyyy: '\\b\\d{4}(?!\\d)',
        yy: '\\b\\d{2}(?!\\d)'
    };
}

let DEFAULT_LOCALE = 'en-us';
let regularExpressions = getRegularExpressions();

export default function mask(dateValue, dateFormat, locale = 'en-us') {
    if (DEFAULT_LOCALE !== locale) {
        DEFAULT_LOCALE = locale;
        regularExpressions = getRegularExpressions(locale);
    }

    const regStringArray = map(regularExpressions, (expression, formatKey) => {
        return `(${formatKey})((?=\\/|\\-|\\ |\\.)|$)`;
    });

    const reg = new RegExp(regStringArray.join('|'), 'mg');

    const matches = dateFormat.toLocaleLowerCase().match(reg);

    const patterns = [];

    times(matches.length, (index) => {
        const subMatches = take(matches, matches.length - index);
        let postfixChar;
        let format = '';
        let pattern = '';
        forEach(subMatches, (matchString, matchIndex) => {
            postfixChar = dateFormat.toLocaleLowerCase().match(new RegExp(`(?<=${matchString})(\\/|\\ |\\-|\\.)`, 'mg'));
            format = format + matchString + (postfixChar && matchIndex !== ((matches.length - index) - 1) ? postfixChar[0] : '');
            pattern = pattern + regularExpressions[matchString] + (postfixChar && matchIndex !== ((matches.length - index) - 1) ? postfixChar[0] : '');
        });


        patterns.push({
            format,
            postfixChar: (postfixChar ? postfixChar[0] : ''),
            pattern
        });
    });

    let newDateValue = dateValue;
    let patternApplied = false;
    forEach(patterns, (patternObj) => {
        if (new RegExp(`^${patternObj.pattern}$`).test(dateValue.toLowerCase())) {
            if (!patternApplied) newDateValue = dateValue + patternObj.postfixChar;
            patternApplied = true;
        }
    });

    newDateValue = newDateValue.replace(/((\/)|(-)|(\.)|( ))((\/)|(-)|(\.)|( ))/g, (match) => {
        return match.substr(0, 1);
    });

    newDateValue = newDateValue.replace(/(^((\/)|(-)|(\.)|( ))$)|[^(\w|/|-|.| )]/g, () => {
        return '';
    });

    return newDateValue;
}


// mask('2', 'mm/dd/yyyy');
// mask('05/31', 'mm/dd/yyyy');
// mask('05/22/1977', 'mm/dd/yyyy');

// mask('mar', 'mmm dd-yyyy');

// mask('05-22', 'mm-dd-yyyy');
// mask('22-December-1977', 'dd-mmmm-yyyy');
// mask('märz-22-1977', 'mmmm-dd-yyyy', 'de');


// new RegExp('(?<!\\d)\\d{2}(?!\\d)-(?<!\\d)\\d{2}(?!\\d)(?!(\\/|\\-|\\.|\\ |\\w))').test('05-22');
// new RegExp('\\b(?:jan|feb?|...|dec?)(?!\\d)').test('dec1 ');
// 'dec1 '.match()
// new RegExp('^\\b(0?[1-9]|1[012])(?!\\d)$').test('05');
// '05/22/1222'.match(new RegExp('\\b(0?[1-9]|1[012])$','mg'));
