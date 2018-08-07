import times from 'lodash/times';

export default function monthNames(format = 'long', locale = 'en-us') {
    const monthNamesList = [];
    const objDate = new Date();
    objDate.setDate(1);
    times(12, (index) => {
        objDate.setMonth(index);
        const longMonth = objDate.toLocaleString(locale, { month: format }).toLowerCase();
        monthNamesList.push(longMonth);
    });
    return monthNamesList;
}
