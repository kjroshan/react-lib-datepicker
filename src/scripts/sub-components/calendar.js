import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import NavigationHeader from './navigation';
import DaySelection from './day-selection';
import MonthSelection from './month-selection';
import YearSelection from './year-selection';
import DecadeSelection from './decade-selection';
import { getDateString } from '../utils';

class Calendar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentDate: props.date,
            currentInterface: 'day-selection'
        };

        this.handleInterfaceChange = this.handleInterfaceChange.bind(this);
        this.handleDaySelection = this.handleDaySelection.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleMonthSelection = this.handleMonthSelection.bind(this);
        this.handleYearSelection = this.handleYearSelection.bind(this);
        this.handleDecadeSelection = this.handleDecadeSelection.bind(this);
        this.renderInterface = this.renderInterface.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ currentDate: nextProps.date });
    }

    handleDaySelection(date) {
        const { onChangeDate } = this.props;
        onChangeDate(date);
    }

    handleDateChange(date) {
        this.setState({
            currentDate: date
        });
    }

    handleMonthSelection(date) {
        this.setState({
            currentDate: date,
            currentInterface: 'day-selection'
        });
    }

    handleYearSelection(date) {
        this.setState({
            currentDate: date,
            currentInterface: 'month-selection'
        });
    }

    handleDecadeSelection(date) {
        this.setState({
            currentDate: date,
            currentInterface: 'year-selection'
        });
    }

    handleInterfaceChange(interfaceName) {
        this.setState({
            currentInterface: interfaceName
        });
    }

    renderInterface(interfaceName) {
        const { calendar, dateFormat, locale, daySelection, maxDate, minDate, monthSelection, yearSelection, decadeSelection, disabledCellClassName } = this.props;
        const { currentDate } = this.state;
        switch (interfaceName) {
        case 'month-selection':
            return (
                <MonthSelection
                    cellClassName={monthSelection.cellClassName}
                    date={currentDate}
                    dateFormat={dateFormat}
                    disabledCellClassName={disabledCellClassName}
                    highlightClassName={calendar.highlightClassName}
                    locale={locale}
                    maxDate={maxDate}
                    minDate={minDate}
                    onMonthSelection={this.handleMonthSelection}
                    className={monthSelection.className}
                />
            );
        case 'year-selection':
            return (
                <YearSelection
                    cellClassName={yearSelection.cellClassName}
                    date={currentDate}
                    dateFormat={dateFormat}
                    disabledCellClassName={disabledCellClassName}
                    highlightClassName={calendar.highlightClassName}
                    locale={locale}
                    maxDate={maxDate}
                    minDate={minDate}
                    onYearSelection={this.handleYearSelection}
                    className={yearSelection.className}
                />
            );

        case 'decade-selection':
            return (
                <DecadeSelection
                    cellClassName={decadeSelection.cellClassName}
                    date={currentDate}
                    dateFormat={dateFormat}
                    disabledCellClassName={disabledCellClassName}
                    highlightClassName={calendar.highlightClassName}
                    locale={locale}
                    maxDate={maxDate}
                    minDate={minDate}
                    onDecadeSelection={this.handleDecadeSelection}
                    className={decadeSelection.className}
                />
            );
        default:
            return (
                <DaySelection
                    cellClassName={daySelection.cellClassName}
                    className={daySelection.className}
                    date={currentDate}
                    dateFormat={dateFormat}
                    dayHeaderClassName={daySelection.dayHeaderClassName}
                    disabledCellClassName={disabledCellClassName}
                    highlightClassName={calendar.highlightClassName}
                    locale={locale}
                    maxDate={maxDate}
                    minDate={minDate}
                    onDaySelection={this.handleDaySelection}
                    weekDayCellClassName={daySelection.weekDayClassName}
                />
            );
        }
    }

    render() {
        const { locale, date, navigation, calendar } = this.props;
        const { currentInterface, currentDate } = this.state;

        return (
            <div className={cn('calendar-container', calendar.className)}>
                <NavigationHeader
                    currentInterface={currentInterface}
                    date={currentDate}
                    enableQuickNavigation={navigation.enableQuickNavigation}
                    hidden={navigation.hidden}
                    labelClassName={navigation.labelClassName}
                    locale={locale}
                    nextClassName={navigation.nextClassName}
                    quickNextClassName={navigation.quickNextClassName}
                    onDateChange={this.handleDateChange}
                    onInterfaceChange={this.handleInterfaceChange}
                    previousClassName={navigation.previousClassName}
                    quickPreviousClassName={navigation.quickPreviousClassName}
                    className={navigation.className}
                />
                {this.renderInterface(currentInterface)}
                {(calendar.showDateDisplay) ?
                    <div className={cn('date-display', calendar.dateDisplayClassName)}>{getDateString(date, locale)}</div>
                :
                    null
                }
            </div>
        );
    }
}

Calendar.propTypes = {
    calendar: PropTypes.shape({
        className: PropTypes.string,
        dateDisplayClassName: PropTypes.string,
        highlightClassName: PropTypes.string,
        id: PropTypes.string,
        showDateDisplay: PropTypes.bool
    }),
    date: PropTypes.instanceOf(Date),
    dateFormat: PropTypes.string,
    daySelection: PropTypes.shape({
        id: PropTypes.string,
        cellClassName: PropTypes.string,
        dayHeaderClassName: PropTypes.string,
        hidden: PropTypes.bool,
        className: PropTypes.string,
        weekDayCellClassName: PropTypes.string
    }),
    decadeSelection: PropTypes.shape({
        id: PropTypes.string,
        cellClassName: PropTypes.string,
        hidden: PropTypes.bool,
        className: PropTypes.string
    }),
    disabledCellClassName: PropTypes.string,
    locale: PropTypes.string,
    maxDate: PropTypes.string,
    minDate: PropTypes.string,
    monthSelection: PropTypes.shape({
        id: PropTypes.string,
        cellClassName: PropTypes.string,
        hidden: PropTypes.bool,
        className: PropTypes.string
    }),
    navigation: PropTypes.shape({
        enableQuickNavigation: PropTypes.bool,
        id: PropTypes.string,
        previousClassName: PropTypes.string,
        quickPreviousClassName: PropTypes.string,
        className: PropTypes.string,
        hidden: PropTypes.bool,
        labelClassName: PropTypes.string,
        nextClassName: PropTypes.string,
        quickNextClassName: PropTypes.string
    }),
    onChangeDate: PropTypes.func,
    yearSelection: PropTypes.shape({
        id: PropTypes.string,
        cellClassName: PropTypes.string,
        hidden: PropTypes.bool,
        className: PropTypes.string
    })
};

Calendar.defaultProps = {
    calendar: {
        className: null,
        dateDisplayClassName: null,
        highlightClassName: '',
        id: '',
        showDateDisplay: true
    },
    date: new Date(),
    dateFormat: 'MM/DD/YYYY',
    daySelection: {
        id: '',
        cellClassName: null,
        dayHeaderClassName: null,
        className: null,
        hidden: false,
        weekDayCellClassName: null
    },
    decadeSelection: {
        id: '',
        cellClassName: null,
        hidden: false,
        className: null
    },
    disabledCellClassName: '',
    locale: 'en-US',
    maxDate: '',
    minDate: '',
    monthSelection: {
        id: '',
        cellClassName: null,
        hidden: false,
        className: null
    },
    navigation: {
        enableQuickNavigation: true,
        id: '',
        previousClassName: null,
        quickPreviousClassName: null,
        className: null,
        hidden: false,
        labelClassName: null,
        nextClassName: null,
        quickNextClassName: null
    },
    onChangeDate: null,
    yearSelection: {
        id: '',
        cellClassName: null,
        hidden: false,
        className: null
    }
};

export default Calendar;
