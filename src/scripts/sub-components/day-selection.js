import React, { Component } from 'react';
import PropTypes from 'prop-types';
import lastDayOfMonth from 'date-fns/last_day_of_month';
import startOfWeek from 'date-fns/start_of_week';
import endOfWeek from 'date-fns/end_of_week';
import differenceInDays from 'date-fns/difference_in_days';
import addDays from 'date-fns/add_days';
import format from 'date-fns/format';
import cn from 'classnames';
import map from 'lodash/map';

import parseDate from '../parse';
import getDayNames from '../day-names';

class DaySelection extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentInterface: 'days'
        };
        this.renderDays = this.renderDays.bind(this);
        this.handleDaySelection = this.handleDaySelection.bind(this);
    }

    handleDaySelection(date) {
        const { onDaySelection } = this.props;
        onDaySelection(date);
    }

    shouldDisableCell(maxDate, minDate, date) {
        if (maxDate) {
            if ((new Date(date.toLocaleDateString())) > (new Date(maxDate.toLocaleDateString()))) return true;
        }

        if (minDate) {
            if ((new Date(date.toLocaleDateString())) < (new Date(minDate.toLocaleDateString()))) return true;
        }

        return false;
    }

    renderWeekHeader() {
        const weekDays = getDayNames('short', this.props.locale);
        return (
            <div>
                {
                    map(weekDays, (weekDay, index) => {
                        const key = `weekDayHeaderColumn${index}`;
                        return (
                            <div
                                key={key}
                                className={cn('day-header-cell', this.props.dayHeaderClassName)}
                            >
                                {weekDay}
                            </div>
                        );
                    })
                }
            </div>
        );
    }

    renderDays() {
        const { date, dateFormat, disabledCellClassName, highlightClassName, locale } = this.props;
        const lastDay = lastDayOfMonth(date);
        const startDate = startOfWeek(new Date(date).setDate(1));
        const endDate = new Date(endOfWeek(lastDay).toDateString());
        const days = [];
        let currentDate = startDate;

        const maxDate = this.props.maxDate ? parseDate(this.props.maxDate, dateFormat, locale) : '';
        const minDate = this.props.minDate ? parseDate(this.props.minDate, dateFormat, locale) : '';

        while (differenceInDays(endDate, currentDate) >= 0) {
            const disabled = date.getMonth() !== currentDate.getMonth();
            const tmpDate = new Date(currentDate);
            const key = `day_key_${tmpDate.getMonth()}_${tmpDate.getDate()}`;
            const disableCell = this.shouldDisableCell(maxDate, minDate, tmpDate);

            const isToday = tmpDate.toLocaleDateString() === date.toLocaleDateString();

            const cellClassName = cn({
                [disabledCellClassName]: disableCell,
                [highlightClassName]: isToday
            });

            days.push(
                (tmpDate.getDay() !== 6 && tmpDate.getDay() !== 0) ?
                    <div
                        key={key}
                        className={cn('weekday-cell', this.props.weekDayCellClassName, cellClassName)}
                        onClick={() => { this.handleDaySelection(tmpDate); }}
                        disabled={disabled}
                    >
                        <time dateTime={format(tmpDate, dateFormat)}>
                            {tmpDate.getDate()}
                        </time>
                    </div>
                :
                    <div
                        key={key}
                        className={cn('day-cell', this.props.cellClassName, cellClassName)}
                        onClick={() => { this.handleDaySelection(tmpDate); }}
                        disabled={disabled}
                    >
                        <time dateTime={format(tmpDate, dateFormat)}>
                            {tmpDate.getDate()}
                        </time>
                    </div>
            );
            currentDate = addDays(currentDate, 1);
        }

        return (
            <div>{ days }</div>
        );
    }

    render() {
        return (
            <div className={cn('selection-view', this.props.className)}>
                <div>
                    {this.renderWeekHeader()}
                    {this.renderDays()}
                </div>
            </div>
        );
    }
}

DaySelection.propTypes = {
    cellClassName: PropTypes.string,
    className: PropTypes.string,
    date: PropTypes.instanceOf(Date),
    dateFormat: PropTypes.string,
    dayHeaderClassName: PropTypes.string,
    disabledCellClassName: PropTypes.string,
    highlightClassName: PropTypes.string,
    locale: PropTypes.string,
    maxDate: PropTypes.string,
    minDate: PropTypes.string,
    onDaySelection: PropTypes.func,
    weekDayCellClassName: PropTypes.string
};

DaySelection.defaultProps = {
    cellClassName: null,
    className: null,
    date: new Date(),
    dateFormat: 'MM/DD/YYYY',
    dayHeaderClassName: null,
    disabledCellClassName: '',
    highlightClassName: '',
    locale: 'en-US',
    maxDate: '',
    minDate: '',
    onDaySelection: null,
    weekDayCellClassName: null
};

export default DaySelection;
