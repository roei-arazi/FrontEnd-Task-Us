import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Boardbar } from '../cmps/Boardbar';
import { loadBoards } from '../store/actions/boardActions'
import { Navbar } from '../cmps/Navbar';
import moment from 'moment'

class _MyWeek extends Component {
    state = {

    }

    componentDidMount() {
        this.props.loadBoards();
    }

    getUpcomingTasks(maxDaysLeft, minDaysLeft = 0) {
        const tasks = [];
        const { boards } = this.props;
        console.log(`getting tasks for the next ${maxDaysLeft} days`);
        console.log('searching in boards:', boards);
        boards.forEach(board => {
            board.groups.forEach(group => {
                tasks.push(...group.tasks.filter(task => {
                    const now = Date.now();
                    return moment(task.dueDate).isBefore(moment(now).add(maxDaysLeft, 'days'))
                        && moment(now).isAfter(moment(task.dueDate).add(minDaysLeft, 'days'))
                }));
            })
        })
        return tasks;
    }

    getDaysFromNow(date){
        // const now = moment(Date.now())
        // const dueDate = moment(date);
        if(moment(date).isBefore(moment(Date.now()).add(1, 'days'))){
            return moment(Date.now()).fromNow(moment(date))
        }

    }

    render() {
        return (
            <section className="my-week">
                <Navbar />
                <Boardbar />
                <div className="my-week-container">
                    <h1>My week's schedule</h1>
                    <section className="upcoming-tasks-container">
                        <h2>This week</h2>
                        {this.getUpcomingTasks(7).map(task => <div
                            key={task.id} className="task-preview space-between align-center">
                            <h2>{task.name}</h2>
                            <h2>{this.getDaysFromNow((task.dueDate + 1000 * 60 * 60 * 24 * 6))}</h2>
                            <div className="user-img-container">
                                {task.members ? task.members[0].imgUrl ? <img alt="profile" src={task.members[0].imgUrl} /> :
                                    <div className="member-letter">{task.members[0].name.charAt(0).toUpperCase()}</div> : ''}
                                <div className="task-number-of-imgs"><span>+{task.members.length ? task.members.length : 0}</span></div>
                            </div>
                        </div>)}
                    </section>
                </div>
            </section>
        )
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

export const MyWeek = connect(mapStateToProps, mapDispatchToProps)(_MyWeek);