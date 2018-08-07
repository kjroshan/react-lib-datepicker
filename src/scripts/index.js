import React, { Component } from 'react';
import PropTypes from 'prop-types';
import format from 'date-fns/format';
import cn from 'classnames';
import Calendar from './sub-components/calendar';
import parseDate from './parse';
import mask from './mask';
import isValidFormat from './is-valid-format';
import isValidDate from './is-valid-date';

class DatePickerComponent extends Component {
    constructor(props) {
        super(props);

        this.getFormattedDate = this.getFormattedDate.bind(this);

        this.state = {
            date: '',
            openCalendar: false,
            lastValidDate: '',
            showCalendar: false,
            maxDate: this.getFormattedDate(props.maxDate),
            minDate: this.getFormattedDate(props.minDate)
        };

        this.initialize = this.initialize.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.closeCalendar = this.closeCalendar.bind(this);
        this.openCalendar = this.openCalendar.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.onChangeInput = this.onChangeInput.bind(this);
        this.onBlurInput = this.onBlurInput.bind(this);
        this.renderDateInputAndDisplay = this.renderDateInputAndDisplay.bind(this);
        this.renderCalendarIcon = this.renderCalendarIcon.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    componentWillMount() {
        this.initialize(this.props.date, this.props.showCalendar);
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillReceiveProps(nextProps) {
        this.initialize(nextProps.date, nextProps.showCalendar);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    onChangeInput(e) {
        const maskedDate = mask(e.target.value, this.props.dateFormat, this.props.locale);
        if (isValidFormat(maskedDate, this.props.dateFormat, this.props.locale) && isValidDate(maskedDate, this.props.dateFormat, this.props.locale)) {
            this.setState({
                date: e.target.value,
                lastValidDate: maskedDate
            });
        } else {
            this.setState({ date: maskedDate });
        }
    }

    onBlurInput(e) {
        if (e.target.value === '') {
            this.setState({ date: '' });
        } else {
            const formatted = format(e.target.value, this.props.dateFormat, { locale: this.props.locale });
            const maskedDate = mask(e.target.value, this.props.dateFormat, this.props.locale);

            if (formatted === 'Invalid Date' || (!isValidFormat(maskedDate, this.props.dateFormat, this.props.locale))) {
                this.setState({ date: this.state.lastValidDate });
            } else if ((formatted !== 'Invalid Date') && isValidDate(maskedDate, this.props.dateFormat, this.props.locale)) {
                this.setState({
                    date: formatted,
                    lastValidDate: formatted
                }, () => this.props.onChange(formatted));
            }
        }
    }

    getFormattedDate(date) {
        let currentDate = date;
        if (currentDate === '' || currentDate == null || currentDate === undefined) {
            return '';
        }

        if (typeof currentDate !== 'string') currentDate = new Date(currentDate);

        const formattedDate = format(currentDate, this.props.dateFormat, { locale: this.props.locale });

        if (formattedDate === 'Invalid Date') {
            return '';
        }

        return formattedDate;
    }

    initialize(date, showCalendar) {
        let currentDate = date;

        if (currentDate === '' || currentDate == null || currentDate === undefined) {
            currentDate = new Date();
        } else if (typeof currentDate !== 'string') {
            currentDate = new Date(currentDate);
        } else {
            currentDate = parseDate(date, this.props.dateFormat, this.props.locale);
        }

        const formattedDate = format(currentDate, this.props.dateFormat, { locale: this.props.locale });

        let validDate = formattedDate;

        if (validDate === 'Invalid Date') {
            validDate = format(new Date(), this.props.dateFormat, { locale: this.props.locale });
        }

        this.setState({
            showCalendar,
            date: (date === '' || date == null || date === undefined || formattedDate === 'Invalid Date') ? '' : formattedDate,
            lastValidDate: validDate,
            openCalendar: this.state.showCalendar !== showCalendar ? showCalendar : this.state.openCalendar
        });
    }

    handleDateChange(dateObject) {
        const formatted = format(dateObject, this.props.dateFormat, { locale: this.props.locale });

        if (formatted === 'Invalid Date') {
            this.setState({
                openCalendar: false,
                date: this.state.lastValidDate
            });
        } else {
            this.setState({
                openCalendar: false,
                date: formatted,
                lastValidDate: formatted
            }, () => this.props.onChange(formatted));
        }
    }

    openCalendar() {
        if (!this.state.openCalendar) {
            this.setState({ openCalendar: true });
        }
    }

    handleKeyDown(e) {
        if (e.keyCode === 13 && this.state.openCalendar) {
            const formatted = format(e.target.value, this.props.dateFormat, { locale: this.props.locale });

            if (formatted === 'Invalid Date') {
                this.setState({
                    openCalendar: false,
                    date: e.target.value
                });
            } else {
                this.setState({
                    openCalendar: false,
                    date: e.target.value,
                    lastValidDate: formatted
                }, () => this.props.onChange(formatted));
            }
        } else {
            this.openCalendar();
        }
    }

    closeCalendar() {
        this.setState({ openCalendar: false, date: this.state.lastValidDate });
    }

    handleClickOutside(e) {
        if (this.node !== null && typeof this.node !== 'undefined') {
            if (this.node.contains(e.target)) {
                return;
            }
            this.setState({ openCalendar: false, date: (!this.state.date) ? '' : this.state.lastValidDate });
        }
    }

    renderDateInputAndDisplay() {
        const { dateInputClassName, showDateInput } = this.props;

        return (
            <div>
                {(showDateInput) ?
                    <input
                        value={this.state.date}
                        onBlur={this.onBlurInput}
                        onMouseDown={this.openCalendar}
                        onKeyDown={this.handleKeyDown}
                        onChange={this.onChangeInput}
                        className={cn('input', dateInputClassName)}
                        placeholder={this.props.dateFormat}
                    />
                :
                    null
                }
            </div>
        );
    }

    renderCalendarIcon() {
        const { activeIconClassName, disabled, disabledIconClassName, iconClassName } = this.props;
        const { openCalendar } = this.state;
        const className = cn(
            'calendar-icon',
            iconClassName,
            { 'calendar-icon-active': openCalendar && (!disabled) },
            { [activeIconClassName]: openCalendar && (!disabled) },
            { 'calendar-icon-disabled': disabled },
            { [disabledIconClassName]: disabled }
        );
        const calendarAction = openCalendar ? this.closeCalendar : this.openCalendar;

        return (
            <div className={className} onClick={calendarAction} />
        );
    }

    render() {
        const { className, dateFormat, id, locale } = this.props;
        const { openCalendar } = this.state;

        return (
            <div className={cn('datepicker', className)} id={id} ref={(node) => { this.node = node; }}>
                {this.renderDateInputAndDisplay()}

                {this.renderCalendarIcon()}

                {(openCalendar) ?
                    <Calendar
                        calendar={{
                            className: this.props.calendarClassName,
                            dateDisplayClassName: this.props.dateDisplayClassName,
                            highlightClassName: this.props.highlightClassName,
                            id: this.props.calendarId,
                            showDateDisplay: this.props.showDateDisplay
                        }}
                        date={parseDate(this.state.lastValidDate, dateFormat, locale)}
                        dateFormat={dateFormat}
                        daySelection={{
                            id: this.props.dayPickerId,
                            cellClassName: this.props.dayPickerCellClassName,
                            dayHeaderClassName: this.props.dayHeaderClassName,
                            className: this.props.dayPickerClassName,
                            hidden: this.props.hideDayPicker,
                            weekDayCellClassName: this.props.weekDayCellClassName
                        }}
                        decadeSelection={{
                            id: this.props.decadePickerId,
                            cellClassName: this.props.decadePickerCellClassName,
                            hidden: this.props.hideDecadePicker,
                            className: this.props.decadePickerClassName
                        }}
                        disabledCellClassName={this.props.disabledCellClassName}
                        locale={locale}
                        maxDate={this.state.maxDate}
                        minDate={this.state.minDate}
                        monthSelection={{
                            id: this.props.monthPickerId,
                            cellClassName: this.props.monthPickerCellClassName,
                            hidden: this.props.hideMonthPicker,
                            className: this.props.monthPickerClassName
                        }}
                        navigation={{
                            enableQuickNavigation: this.props.enableQuickNavigation,
                            id: this.props.navigationId,
                            previousClassName: this.props.previousClassName,
                            quickPreviousClassName: this.props.quickPreviousClassName,
                            className: this.props.navigationClassName,
                            hidden: this.props.hideNavigation,
                            labelClassName: this.props.navigationLabelClassName,
                            nextClassName: this.props.nextClassName,
                            quickNextClassName: this.props.quickNextClassName
                        }}
                        yearSelection={{
                            id: this.props.yearPickerId,
                            cellClassName: this.props.yearPickerCellClassName,
                            hidden: this.props.hideYearPicker,
                            className: this.props.yearPickerClassName
                        }}
                        onChangeDate={this.handleDateChange}
                    />
                    :
                        null
                    }
            </div>
        );
    }
}

DatePickerComponent.propTypes = {
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
};

DatePickerComponent.defaultProps = {
    activeIconClassName: null,
    calendarClassName: null,
    calendarId: '',
    className: null,
    date: '',
    dateDisplayClassName: null,
    dateFormat: 'MM/DD/YYYY',
    dateInputClassName: null,
    dayHeaderClassName: null,
    dayPickerCellClassName: null,
    dayPickerClassName: null,
    dayPickerId: '',
    decadePickerCellClassName: null,
    decadePickerClassName: null,
    decadePickerId: '',
    disabled: false,
    disabledCellClassName: 'disabled-cell',
    disabledIconClassName: null,
    enableQuickNavigation: true,
    hideDayPicker: false,
    hideDecadePicker: false,
    hideMonthPicker: false,
    hideNavigation: false,
    hideYearPicker: false,
    highlightClassName: 'highlight-cell',
    iconClassName: null,
    id: '',
    locale: 'en-US',
    maxDate: '05/26/2070',
    minDate: '05/26/2016',
    monthPickerCellClassName: null,
    monthPickerClassName: null,
    monthPickerId: '',
    navigationClassName: null,
    navigationId: '',
    navigationLabelClassName: null,
    nextClassName: null,
    onChange: null,
    previousClassName: null,
    quickNextClassName: null,
    quickPreviousClassName: null,
    showCalendar: false,
    showDateDisplay: true,
    showDateInput: true,
    weekDayCellClassName: null,
    yearPickerCellClassName: null,
    yearPickerClassName: null,
    yearPickerId: ''
};


export default DatePickerComponent;
