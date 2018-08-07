import React, { Component } from 'react';
import PropTypes from 'prop-types';
import startCase from 'lodash/startCase';
import format from 'date-fns/format';
import cn from 'classnames';
import map from 'lodash/map';

import parseDate from '../parse';
import getMonthNames from '../month-names';

class MonthSelection extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: 'month-selection'
        };

        this.handleMonthSelection = this.handleMonthSelection.bind(this);
    }

    handleMonthSelection(date) {
        const { onMonthSelection } = this.props;
        onMonthSelection(new Date(date));
    }

    shouldDisableCell(maxDate, minDate, date) {
        if (maxDate) {
            const maxYear = maxDate.getFullYear();
            const maxMonth = maxDate.getMonth();
            if (date.getFullYear() > maxYear) return true;
            if (date.getFullYear() >= maxYear && date.getMonth() > maxMonth) return true;
        }

        if (minDate) {
            const minYear = minDate.getFullYear();
            const minMonth = minDate.getMonth();
            if (date.getFullYear() < minYear) return true;
            if (date.getFullYear() <= minYear && date.getMonth() < minMonth) return true;
        }

        return false;
    }

    render() {
        const { className, date, dateFormat, disabledCellClassName, highlightClassName, locale } = this.props;
        const monthNames = getMonthNames('short', locale);
        const maxDate = this.props.maxDate ? parseDate(this.props.maxDate, dateFormat, locale) : '';
        const minDate = this.props.minDate ? parseDate(this.props.minDate, dateFormat, locale) : '';

        return (
            <div className={cn('selection-view', className)}>
                {
                    map(monthNames, (monthName, index) => {
                        const key = `month_key_${index}`;
                        const tmpDate = new Date(date).setMonth(index);
                        const disableCell = this.shouldDisableCell(maxDate, minDate, new Date(tmpDate));
                        const isThisMonth = (new Date(tmpDate)).getMonth() === date.getMonth();

                        const cellClassName = cn(
                            'month-year-cell',
                            this.props.cellClassName,
                            {
                                [disabledCellClassName]: disableCell,
                                [highlightClassName]: isThisMonth
                            }

                        );

                        return (
                            <div
                                key={key}
                                className={cellClassName}
                                onClick={() => { this.handleMonthSelection(tmpDate); }}
                            >
                                <time dateTime={format(tmpDate, dateFormat)}>
                                    {startCase(monthName)}
                                </time>
                            </div>
                        );
                    })
                }
            </div>
        );
    }
}

MonthSelection.propTypes = {
    cellClassName: PropTypes.string,
    className: PropTypes.string,
    date: PropTypes.instanceOf(Date),
    dateFormat: PropTypes.string,
    disabledCellClassName: PropTypes.string,
    highlightClassName: PropTypes.string,
    locale: PropTypes.string,
    maxDate: PropTypes.string,
    minDate: PropTypes.string,
    onMonthSelection: PropTypes.func
};

MonthSelection.defaultProps = {
    cellClassName: null,
    className: null,
    date: new Date(),
    dateFormat: 'MM/DD/YYYY',
    disabledCellClassName: '',
    highlightClassName: '',
    locale: 'en-us',
    maxDate: '',
    minDate: '',
    onMonthSelection: null
};

export default MonthSelection;
