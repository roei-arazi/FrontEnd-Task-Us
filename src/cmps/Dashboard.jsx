import React, { Component } from 'react';
import * as d3 from 'd3';

export class Dashboard extends Component {
    componentDidMount() {
        this.ref = React.createRef();
        d3.select(this.ref.current)
            .append('p')
            .text('I\'m here!')
    }
    render() {
        return <div ref={this.ref}></div>
    }
}