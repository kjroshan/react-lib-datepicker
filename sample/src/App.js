/* eslint-disable*/
import React, { Component } from 'react';

import CustomDatePicker from './custom-datepicker';


class App extends Component {
    constructor() {
        super();
        this.state = {
            name: 'react lib datepicker'
        };
    }

    render() {
        return (
            <CustomDatePicker />
        );
    }
}

export default App;
