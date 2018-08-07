// function getDayIteratorBackup(startDate, endDate, dateFormat) {
//     let currentDate = startDate;
//     return {
//         [Symbol.iterator]() {
//             return (function* nextDay() {
//                 if (differenceInDays(endDate, currentDate) <= 0) {
//                     yield (
//                         <button
//                             className="react-calendar__tile react-calendar__month-view__days__day react-calendar__month-view__days__day--weekend react-calendar__month-view__days__day--neighboringMonth"
//                             type="button"
//                             style={{ flexBasis: '14.2857%', overflow: 'hidden' }}
//                         >
//                             <time dateTime={format(currentDate, dateFormat)}>
//                                 {currentDate.getDate()}
//                             </time>
//                         </button>
//                     );
//                     currentDate = addDays(currentDate, 1);
//                     yield* nextDay();
//                 }
//             }());
//         }
//     };
// }

// function getDayIterator(startDate, endDate, dateFormat) {
//     let currentDate = startDate;
//     return {
//         [Symbol.iterator]() {
//             return {
//                 next() {
//                     if (differenceInDays(endDate, currentDate) > 0) {
//                         const tmpDate = new Date(currentDate);
//                         currentDate = addDays(currentDate, 1);
//                         return {
//                             value: (
//                                 <button
//                                     className="react-calendar__tile react-calendar__month-view__days__day react-calendar__month-view__days__day--weekend react-calendar__month-view__days__day--neighboringMonth"
//                                     type="button"
//                                     style={{ flexBasis: '14.2857%', overflow: 'hidden' }}
//                                 >
//                                     <time dateTime={format(tmpDate, dateFormat)}>
//                                         {tmpDate.getDate()}
//                                     </time>
//                                 </button>
//                             ),
//                             done: false
//                         };
//                     }
//                     return ({ done: true });
//                 }
//             };
//         }
//     };
// }
