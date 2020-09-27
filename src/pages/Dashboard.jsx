import React, { Component, Fragment } from 'react';
import * as d3 from 'd3';
import Chart from 'react-apexcharts'
import { Navbar } from '../cmps/Navbar';
import { Boardbar } from '../cmps/Boardbar';
import { MobileNav } from '../mobile-pages/MobileNav';

export class Dashboard extends Component {
    state = {
        options: {
            chart: {
                id: 'apexchart-example'
            },
            xaxis: {
                categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998]
            }
        },
        series: [{
            name: 'series-1',
            data: [30, 40, 45, 50, 49, 60, 70, 91]
        }]
    }

    componentDidMount() {
        this.ref = React.createRef();
        d3.select(this.ref.current)
            .append('p')
            .text('I\'m here!')
    }
    render() {
        return <section className="flex" ref={this.ref}>
            {window.innerWidth > 450 ?
                <Fragment>
                    <Navbar />
                    <Boardbar />
                </Fragment>
                : <MobileNav loggedUser={this.props.loggedUser} />
            }
            <Chart options={this.state.options} series={this.state.series} type="bar" width={500} height={320} />

        </section>
    }
}