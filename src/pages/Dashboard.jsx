import React, { Component, Fragment } from 'react';
import Chart from 'react-apexcharts';
import { connect } from 'react-redux';

import { Navbar } from '../cmps/Navbar';
import { Boardbar } from '../cmps/Boardbar';
import { MobileNav } from '../mobile-pages/MobileNav';
import { userService } from '../services/userService.js';
import { loadBoards } from '../store/actions/boardActions.js'

export class _Dashboard extends Component {
    state = {

        series: [],
        options: {
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
        }
    }


    async componentDidMount() {
        await this.props.loadBoards();
        const users = await userService.loadUsers();
        const board = this.props.boards[this.props.boards.length - 1];
        const boardMembers = board.members.map(member => {
            const user = users.find(currUser => currUser._id === member._id);
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
        })
        const options = { ...this.state.options };
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
        this.setState({ series, options })
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
            <Chart options={this.state.options} series={this.state.series} type="bar" width={'90%'} height={'90%'} />

        </section>
    }
}

const mapStateToProps = state => {
    return {
        boards: state.boardReducer.boards
    }
}

const mapDispatchToProps = {
    loadBoards
}

export const Dashboard = connect(mapStateToProps, mapDispatchToProps)(_Dashboard)