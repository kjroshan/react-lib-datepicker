## Date Picker 

###Properties

    activeIconClassName: PropTypes.string,
    calendarClassName: PropTypes.string,
    calendarId: PropTypes.string,
    className: PropTypes.string,
    date: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    dateDisplayClassName: PropTypes.string,
    dateFormat: PropTypes.string,
    dateInputClassName: PropTypes.string,
    dayHeaderClassName: PropTypes.string,
    dayPickerCellClassName: PropTypes.string,
    dayPickerClassName: PropTypes.string,
    dayPickerId: PropTypes.string,
    decadePickerCellClassName: PropTypes.string,
    decadePickerClassName: PropTypes.string,
    decadePickerId: PropTypes.string,
    disabled: PropTypes.bool,
    disabledCellClassName: PropTypes.string,
    disabledIconClassName: PropTypes.string,
    enableQuickNavigation: PropTypes.bool,
    hideDayPicker: PropTypes.bool,
    hideDecadePicker: PropTypes.bool,
    hideMonthPicker: PropTypes.bool,
    hideNavigation: PropTypes.bool,
    hideYearPicker: PropTypes.bool,
    highlightClassName: PropTypes.string,
    iconClassName: PropTypes.string,
    id: PropTypes.string,
    locale: PropTypes.string,
    maxDate: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    minDate: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    monthPickerCellClassName: PropTypes.string,
    monthPickerClassName: PropTypes.string,
    monthPickerId: PropTypes.string,
    navigationClassName: PropTypes.string,
    navigationId: PropTypes.string,
    navigationLabelClassName: PropTypes.string,
    nextClassName: PropTypes.string,
    onChange: PropTypes.func,
    previousClassName: PropTypes.string,
    quickNextClassName: PropTypes.string,
    quickPreviousClassName: PropTypes.string,
    showCalendar: PropTypes.bool,
    showDateDisplay: PropTypes.bool,
    showDateInput: PropTypes.bool,
    weekDayCellClassName: PropTypes.string,
    yearPickerCellClassName: PropTypes.string,
    yearPickerClassName: PropTypes.string,
    yearPickerId: PropTypes.string

----

### Simple Usage
    npm install react-lib-datepicker

----

    import Datepicker from 'react-lib-datepicker';
    
    export default function CustomDatepicker(){
        return(
            <Datepicker
                date='11/06/1988'
                dateFormat='DD/MM/YYYY'
            />
        );
    }

### custom date input-box implementation
    

    import Datepicker from 'react-lib-datepicker';
    import React, { Component } from 'react';
    import format from 'date-fns/format';

    export default class CustomDatepicker extends Component {
        constructor(props) {
            super(props);

            this.state = {
                date: format(new Date(), ' DD/MM/YYYY')
            };
        }

        onDateSelect = (dateString) => {
            this.setState({
                date: dateString
            });
        }

        handleChange = (event) => {
            this.setState({
                date: event.target.value
            });
        }

        render() {
            return (
                <div>
                    <input type="text" value={this.state.date} onChange={this.handleChange} />

                    <Datepicker
                        date={this.state.date}
                        dateFormat="DD/MM/YYYY"
                        showDateInput={false}
                        onChange={this.onDateSelect}
                    />
                </div>
            );
        }
    }


###Parse

    import parse from 'react-lib-datepicker/parse';
    
    parse('December/22/1971'); // Error because default format is mm/dd/yyyy
    parse('December/22/1972','mmm/dd/yyyy')
    parse('22/03/1973','dd/mm/yyyy')
    parse('december 23 1974','mmmddyyyy')
    parse('märz 20 1975','mmmddyyyy','de')
    parse('21 märz 1996','ddmmmyyyy','de')
    parse('11/märz/1988','dd/mmm/yyyy','de')
    parse('13-märz-1988','dd-mmm-yyyy','de')
    parse('13-märz 1986','dd-mmm yyyy','de')

----
### dateParts
    import dateParts from 'react-lib-datepicker/date-parts';

    const parts = dateParts(new Date());
    console.log(parts.day, parts.month, parts.year);

### dayNames
    import dayNames from 'react-lib-datepicker/day-names';

    const days = dayNames('long', 'de');


### monthNames
    import monthNames from 'react-lib-datepicker/month-names';

    const months = monthNames('long', 'de');

### isValidDate
    import isValidDate from 'react-lib-datepicker/is-valid-date';

    const isValid = isValidDate('33/02/1988', 'DD/MM/YYYY', 'en-us');


### isValidFormat
    import isValidFormat from 'react-lib-datepicker/is-valid-format';

    const isValid = isValidFormat('28/02/1988', 'DD/MM/YYYY', 'en-us');  

### mask
    import mask from 'react-lib-datepicker/mask';

    const maskedDateString = mask('28/02', 'DD/MM/YYYY', 'en-us');  


