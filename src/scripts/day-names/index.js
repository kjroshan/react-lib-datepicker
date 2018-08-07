import times from 'lodash/times';
import startOfWeek from 'date-fns/start_of_week';
import addDays from 'date-fns/add_days';

export default function dayNames(format = 'long', locale = 'en-us') {
    const dayNamesList = [];
    const currentDate = new Date();
    const objDate = startOfWeek(currentDate);
    times(7, (index) => {
        const dateObj = addDays(objDate, index);
        const shortDay = dateObj.toLocaleString(locale, { weekday: format }).toUpperCase();
        dayNamesList.push(shortDay.charAt(0));
    });
    return dayNamesList;
}
