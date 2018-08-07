import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import addMonths from 'date-fns/add_months';
import subMonths from 'date-fns/sub_months';
import addYears from 'date-fns/add_years';
import subYears from 'date-fns/sub_years';
import startCase from 'lodash/startCase';
import getMonthNames from '../month-names';

class NavigationHeader extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentMonth: props.date.getMonth(),
            currentYear: props.date.getFullYear(),
        };
        this.handleMonthSelection = this.handleMonthSelection.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleInterfaceChange = this.handleInterfaceChange.bind(this);
        this.renderCurrentInterface = this.renderCurrentInterface.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            currentMonth: nextProps.date.getMonth(),
            currentYear: nextProps.date.getFullYear()
        });
    }

    handleMonthSelection(date) {
        this.handleDateChange(date);
    }

    handleYearSelection(date) {
        this.handleDateChange(date);
    }

    handleDateChange(date) {
        const { onDateChange } = this.props;
        onDateChange(date);
    }

    handleInterfaceChange(interfaceName) {
        const { onInterfaceChange } = this.props;
        onInterfaceChange(interfaceName);
    }

    renderDaySelection() {
        const { date, locale } = this.props;
        const { currentMonth, currentYear } = this.state;
        const monthNames = getMonthNames('long', locale);
        const monthName = monthNames[currentMonth];
        return (
            <div className={cn('navigation', this.props.className)}>
                {(this.props.enableQuickNavigation) ?
                    <div
                        className={cn('navigation-previous-double', this.props.quickPreviousClassName)}
                        onClick={() => { this.handleYearSelection(subYears(date, 1)); }}
                    />
                :
                    null
                }
                <div
                    className={cn('navigation-previous', this.props.previousClassName)}
                    onClick={() => { this.handleMonthSelection(subMonths(date, 1)); }}
                />
                <div
                    className={cn('navigation-label', this.props.labelClassName)}
                    onClick={() => { this.handleInterfaceChange('month-selection'); }}
                >
                    {`${startCase(monthName)}, ${currentYear}`}
                </div>
                <div
                    className={cn('navigation-next', this.props.nextClassName)}
                    onClick={() => { this.handleMonthSelection(addMonths(date, 1)); }}
                />
                {(this.props.enableQuickNavigation) ?
                    <div
                        className={cn('navigation-next-double', this.props.quickNextClassName)}
                        onClick={() => { this.handleYearSelection(addYears(date, 1)); }}
                    />
                :
                    null
                }
            </div>
        );
    }

    renderMonthSelection() {
        const { date } = this.props;
        const { currentYear } = this.state;

        return (
            <div className={cn('navigation', this.props.className)}>
                {(this.props.enableQuickNavigation) ?
                    <div
                        className={cn('navigation-previous-double', this.props.quickPreviousClassName)}
                        onClick={() => { this.handleYearSelection(subYears(date, 10)); }}
                    />
                :
                    null
                }
                <div
                    className={cn('navigation-previous', this.props.previousClassName)}
                    onClick={() => { this.handleYearSelection(subYears(date, 1)); }}
                />
                <div
                    className={cn('navigation-label', this.props.labelClassName)}
                    onClick={() => { this.handleInterfaceChange('year-selection'); }}
                >
                    {`${currentYear}`}
                </div>
                <div
                    className={cn('navigation-next', this.props.nextClassName)}
                    onClick={() => { this.handleYearSelection(addYears(date, 1)); }}
                />
                {(this.props.enableQuickNavigation) ?
                    <div
                        className={cn('navigation-next-double', this.props.quickNextClassName)}
                        onClick={() => { this.handleYearSelection(addYears(date, 10)); }}
                    />
                :
                    null
                }
            </div>
        );
    }

    renderYearSelection() {
        const { date } = this.props;
        const { currentYear } = this.state;
        const startYear = (Math.floor((currentYear - 1) / 10) * 10) + 1;
        const endYear = Math.ceil((currentYear) / 10) * 10;
        return (
            <div className={cn('navigation', this.props.className)}>
                {(this.props.enableQuickNavigation) ?
                    <div
                        className={cn('navigation-previous-double', this.props.quickPreviousClassName)}
                        onClick={() => { this.handleYearSelection(subYears(date, 100)); }}
                    />
                :
                    null
                }
                <div
                    className={cn('navigation-previous', this.props.previousClassName)}
                    onClick={() => { this.handleYearSelection(subYears(date, 10)); }}
                />
                <div
                    className={cn('navigation-label', this.props.labelClassName)}
                    onClick={() => { this.handleInterfaceChange('decade-selection'); }}
                >
                    {`${startYear} - ${endYear}`}
                </div>
                <div
                    className={cn('navigation-next', this.props.nextClassName)}
                    onClick={() => { this.handleYearSelection(addYears(date, 10)); }}
                />
                {(this.props.enableQuickNavigation) ?
                    <div
                        className={cn('navigation-next-double', this.props.quickNextClassName)}
                        onClick={() => { this.handleYearSelection(addYears(date, 100)); }}
                    />
                :
                    null
                }
            </div>
        );
    }

    renderDecadeSelection() {
        const { date } = this.props;
        const { currentYear } = this.state;
        const startYear = (Math.floor((currentYear - 1) / 100) * 100) + 1;
        const endYear = Math.ceil((currentYear) / 100) * 100;
        return (
            <div className={cn('navigation', this.props.className)} id={this.props.id}>
                <div
                    className={cn('navigation-previous', this.props.previousClassName)}
                    onClick={() => { this.handleYearSelection(subYears(date, 100)); }}
                />
                <div
                    className={cn('navigation-label', this.props.labelClassName)}
                    disabled
                >
                    {`${startYear} - ${endYear}`}
                </div>
                <div
                    className={cn('navigation-next', this.props.nextClassName)}
                    onClick={() => { this.handleYearSelection(addYears(date, 100)); }}
                />
            </div>
        );
    }

    renderCurrentInterface(interfaceName) {
        switch (interfaceName) {
        case 'month-selection':
            return this.renderMonthSelection();
        case 'year-selection':
            return this.renderYearSelection();
        case 'decade-selection':
            return this.renderDecadeSelection();
        default:
            return this.renderDaySelection();
        }
    }

    render() {
        const { currentInterface, hidden } = this.props;

        if (hidden) return null;

        return (
            <div>
                { this.renderCurrentInterface(currentInterface) }
            </div>
        );
    }
}

NavigationHeader.propTypes = {
    className: PropTypes.string,
    currentInterface: PropTypes.string,
    date: PropTypes.instanceOf(Date),
    enableQuickNavigation: PropTypes.bool,
    hidden: PropTypes.bool,
    id: PropTypes.string,
    labelClassName: PropTypes.string,
    locale: PropTypes.string,
    nextClassName: PropTypes.string,
    onDateChange: PropTypes.func,
    onInterfaceChange: PropTypes.func,
    previousClassName: PropTypes.string,
    quickNextClassName: PropTypes.string,
    quickPreviousClassName: PropTypes.string
};

NavigationHeader.defaultProps = {
    className: null,
    currentInterface: 'day-selection',
    date: new Date(),
    enableQuickNavigation: true,
    hidden: false,
    id: '',
    labelClassName: null,
    locale: 'en-US',
    nextClassName: null,
    onDateChange: null,
    onInterfaceChange: null,
    previousClassName: null,
    quickNextClassName: null,
    quickPreviousClassName: null
};

export default NavigationHeader;
