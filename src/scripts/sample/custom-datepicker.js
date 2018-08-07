/* eslint-disable */
    import Datepicker from 'react-lib-datepicker';
    import React, { Component } from 'react';
    import format from 'date-fns/format';

    export default class CustomDatepicker extends Component {
        constructor(props) {
            super(props);

            this.state = {
                date: format(new Date(), ' DD/MM/YYYY')
            };

            this.onDateSelect = this.onDateSelect.bind(this);
            this.handleChange = this.handleChange.bind(this);
        }

        onDateSelect(dateString) {
            this.setState({
                date: dateString
            });
        }

        handleChange(event) {
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
