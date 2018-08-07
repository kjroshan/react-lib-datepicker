export function getDateString(dateValue, locale = 'en-us') {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    return dateValue.toLocaleDateString(locale, options);
}
