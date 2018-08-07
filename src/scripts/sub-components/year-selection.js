import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import format from 'date-fns/format';
import map from 'lodash/map';

import parseDate from '../parse';

class YearSelection extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: 'year-selection'
        };

        this.handleYearSelection = this.handleYearSelection.bind(this);
    }

    handleYearSelection(date) {
        const { onYearSelection } = this.props;
        onYearSelection(new Date(date));
    }

    shouldDisableCell(maxDate, minDate, yearValue) {
        if (maxDate) {
            const maxYear = maxDate.getFullYear();
            if (yearValue > maxYear) return true;
        }

        if (minDate) {
            const minYear = minDate.getFullYear();
            if (yearValue < minYear) return true;
        }

        return false;
    }

    render() {
        const { date, dateFormat, disabledCellClassName, highlightClassName, locale } = this.props;
        const currentYear = date.getFullYear();
        const startYear = (Math.floor((currentYear - 1) / 10) * 10) + 1;
        const mapHelper = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        const maxDate = this.props.maxDate ? parseDate(this.props.maxDate, dateFormat, locale) : '';
        const minDate = this.props.minDate ? parseDate(this.props.minDate, dateFormat, locale) : '';

        return (
            <div className={cn('selection-view', this.props.className)}>
                {
                    map(mapHelper, (yearIncrement) => {
                        const yearValue = startYear + yearIncrement;
                        const key = `year_key_${yearValue}`;
                        const tmpDate = new Date(date).setYear(yearValue);

                        const disableCell = this.shouldDisableCell(maxDate, minDate, yearValue);

                        const isThisYear = (new Date(tmpDate)).getFullYear() === date.getFullYear();

                        const cellClassName = cn(
                            'month-year-cell',
                            this.props.cellClassName,
                            {
                                [disabledCellClassName]: disableCell,
                                [highlightClassName]: isThisYear
                            }
                        );

                        return (
                            <div
                                key={key}
                                className={cellClassName}
                                onClick={() => { this.handleYearSelection(tmpDate); }}
                            >
                                <time dateTime={format(tmpDate, dateFormat, { locale })}>
                                    {yearValue}
                                </time>
                            </div>
                        );
                    })
                }
            </div>
        );
    }
}

YearSelection.propTypes = {
    cellClassName: PropTypes.string,
    className: PropTypes.string,
    date: PropTypes.instanceOf(Date),
    dateFormat: PropTypes.string,
    disabledCellClassName: PropTypes.string,
    highlightClassName: PropTypes.string,
    locale: PropTypes.string,
    maxDate: PropTypes.string,
    minDate: PropTypes.string,
    onYearSelection: PropTypes.func
};

YearSelection.defaultProps = {
    cellClassName: null,
    className: null,
    date: new Date(),
    dateFormat: 'MM/DD/YYYY',
    disabledCellClassName: '',
    highlightClassName: '',
    locale: 'en-US',
    maxDate: '',
    minDate: '',
    onYearSelection: null
};

export default YearSelection;
