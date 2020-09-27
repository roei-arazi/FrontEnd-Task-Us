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
        series: [{
            name: 'PRODUCT A',
            data: [44, 55, 41, 67, 22, 43, 21, 49]
        }, {
            name: 'PRODUCT B',
            data: [13, 23, 20, 8, 13, 27, 33, 12]
        }, {
            name: 'PRODUCT C',
            data: [11, 17, 15, 15, 21, 14, 15, 13]
        }],
        options: {
            chart: {
                type: 'bar',
                height: 350,
                stacked: true,
                stackType: '100%'
            },
            colors: ['#2E93fA', '#66DA26', '#546E7A', '#E91E63', '#FF9800'],
            responsive: [{
                breakpoint: 480,
                options: {
                    legend: {
                        position: 'bottom',
                        offsetX: -10,
                        offsetY: 0
                    }
                }
            }],
            xaxis: {
                categories: ['2011 Q1', '2011 Q2', '2011 Q3', '2011 Q4', '2012 Q1', '2012 Q2',
                    '2012 Q3', '2012 Q4'
                ],
            },
            fill: {
                opacity: 1
            },
            legend: {
                position: 'right',
                offsetX: 0,
                offsetY: 50
            },
        },


    }

    async componentDidMount() {
        await this.props.loadBoards();
        const users = await userService.loadUsers();
        const board = this.props.boards[this.props.boards.length - 1];
        const boardMembers = board.members.map(member =>{
            const user = users.find(currUser => currUser._id === member._id);
            user.done = 0;
            user['working on it'] = 0;
            user.stuck = 0;
            user.other = 0;
            return user;
        })
        boardMembers.forEach(member =>{
            board.groups.forEach(group =>{
                group.tasks.forEach(task =>{
                    if(task.members.some(currMember => currMember._id === member._id)){ 
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
        boardMembers.forEach(member =>{
            names.push(member.fullName);
            done.push(member.done);
            working.push(member['working on it']);
            stuck.push(member.stuck);
            other.push(member.other)
        })
        const options = {...this.state.options};
        options.xaxis = {categories: names};
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
        this.setState({series, options})
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

const mapStateToProps = state => {
    return {
        boards: state.boardReducer.boards
    }
}

const mapDispatchToProps = {
    loadBoards
}

export const Dashboard = connect(mapStateToProps, mapDispatchToProps)(_Dashboard)