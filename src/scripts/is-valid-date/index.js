import getDateParts from '../date-parts';

export default function isValidDate(dateValue, dateFormat = 'mm/dd/yyyy', locale = 'en-us') {
    const dateParts = getDateParts(dateValue, dateFormat, locale);

    const day = dateParts.day;
    const month = dateParts.month;
    const year = dateParts.year;

    // Check the ranges of month and year
    if (year < 1 || year > 9999 || month === 0 || month > 12) { return false; }

    const monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    // Adjust for leap years
    if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) { monthLength[1] = 29; }

    // Check the range of the day
    return day > 0 && day <= monthLength[month - 1];
}
