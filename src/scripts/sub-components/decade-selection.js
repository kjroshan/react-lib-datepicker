import React, { Component } from 'react';
import PropTypes from 'prop-types';
import format from 'date-fns/format';
import cn from 'classnames';
import map from 'lodash/map';

import parseDate from '../parse';

class DecadeSelection extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: 'year-selection'
        };

        this.handleDecadeSelection = this.handleDecadeSelection.bind(this);
    }

    handleDecadeSelection(date) {
        this.props.onDecadeSelection(new Date(date));
    }

    shouldDisableCell(maxDate, minDate, startYearValue, endYearValue) {
        if (maxDate) {
            const maxYear = maxDate.getFullYear();
            if (startYearValue > maxYear) return true;
        }

        if (minDate) {
            const minYear = minDate.getFullYear();
            if (endYearValue < minYear) return true;
        }

        return false;
    }

    render() {
        const { date, dateFormat, disabledCellClassName, highlightClassName, locale } = this.props;
        const currentYear = date.getFullYear();
        const startYear = (Math.floor((currentYear - 1) / 100) * 100) + 1;
        const mapHelper = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90];

        const maxDate = this.props.maxDate ? parseDate(this.props.maxDate, dateFormat, locale) : '';
        const minDate = this.props.minDate ? parseDate(this.props.minDate, dateFormat, locale) : '';

        return (
            <div className={cn('selection-view', this.props.className)}>
                {
                    map(mapHelper, (yearIncrement) => {
                        const startYearValue = startYear + yearIncrement;
                        const endYearValue = startYear + yearIncrement + 9;
                        const key = `year_key_${startYearValue}_${endYearValue}`;
                        const tmpDate = new Date(date).setYear(startYearValue);

                        const disableCell = this.shouldDisableCell(maxDate, minDate, startYearValue, endYearValue);
                        const isThisDecade = (startYearValue <= date.getFullYear() && endYearValue >= date.getFullYear());

                        const cellClassName = cn(
                            'decade-cell',
                            this.props.cellClassName,
                            {
                                [disabledCellClassName]: disableCell,
                                [highlightClassName]: isThisDecade
                            }
                        );

                        return (
                            <div
                                key={key}
                                className={cellClassName}
                                onClick={() => { this.handleDecadeSelection(tmpDate); }}
                            >
                                <time dateTime={format(tmpDate, dateFormat, { locale })}>
                                    {`${startYearValue} - ${endYearValue}`}
                                </time>
                            </div>
                        );
                    })
                }
            </div>
        );
    }
}

DecadeSelection.propTypes = {
    cellClassName: PropTypes.string,
    className: PropTypes.string,
    date: PropTypes.instanceOf(Date),
    dateFormat: PropTypes.string,
    disabledCellClassName: PropTypes.string,
    highlightClassName: PropTypes.string,
    locale: PropTypes.string,
    maxDate: PropTypes.string,
    minDate: PropTypes.string,
    onDecadeSelection: PropTypes.func
};

DecadeSelection.defaultProps = {
    cellClassName: null,
    className: null,
    date: new Date(),
    dateFormat: 'YYYY-MM-DD',
    disabledCellClassName: '',
    highlightClassName: '',
    locale: 'en-US',
    maxDate: '',
    minDate: '',
    onDecadeSelection: null
};

export default DecadeSelection;
