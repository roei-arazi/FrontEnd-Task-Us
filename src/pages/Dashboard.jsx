import React, { Component, Fragment } from 'react';
import Chart from 'react-apexcharts';

import { Navbar } from '../cmps/Navbar';
import { Boardbar } from '../cmps/Boardbar';
import { MobileNav } from '../mobile-pages/MobileNav';

export function Dashboard(props) {

    const { board } = props;
    const boardMembers = board.members.map(member => {
        const user = { ...member };
        user.done = 0;
        user['working on it'] = 0;
        user.stuck = 0;
        user.other = 0;
        return user;
    })

    boardMembers.forEach(member => {
        board.groups.forEach(group => {
            group.tasks.forEach(task => {
                if (task.members.some(currMember => currMember._id === member._id)) {
                    task.status ? member[task.status.toLowerCase()]++ : member.other++;
                }
            })
        })
    })

    const names = [],
        done = [],
        working = [],
        stuck = [],
        other = [];

    boardMembers.forEach(member => {
        names.push(member.fullName);
        done.push(member.done);
        working.push(member['working on it']);
        stuck.push(member.stuck);
        other.push(member.other)
    });

    const options = {
        colors: ['#00ca72', '#fdab3d', '#e44258', '#a8a8a8'],
        chart: {
            type: 'bar',
            height: '100%',
            width: '100%',
            stacked: true,
            toolbar: {
                show: true
            },
            zoom: {
                enabled: true
            }
        },
        responsive: [],
        plotOptions: {
            bar: {
                horizontal: false,
            },
        },
        xaxis: {
            categories: [
            ],
        },
        legend: {
            position: 'right',
            offsetY: 40
        },
        fill: {
            opacity: 1
        }
    };

    options.xaxis = { categories: names };
    const series = [
        {
            name: 'Done',
            data: done
        },
        {
            name: 'Working on it',
            data: working
        },
        {
            name: 'Stuck',
            data: stuck
        },
        {
            name: 'Other',
            data: other
        }
    ]
    return <section className="flex" ref={this.ref}>
        {window.innerWidth > 450 ?
            <Fragment>
                <Navbar />
                <Boardbar />
            </Fragment>
            : <MobileNav loggedUser={this.props.loggedUser} />
        }
        <Chart options={options} series={series} type="bar" width={'90%'} height={'90%'} />

    </section>
}
