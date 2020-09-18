import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Boardbar } from '../cmps/Boardbar';
import { loadBoards } from '../store/actions/boardActions'
import { Navbar } from '../cmps/Navbar';
import moment from 'moment'
import { withRouter } from 'react-router-dom';

class _MyWeek extends Component {
    state = {

    }

    componentDidMount() {
        this.props.loadBoards();
    }

    getUpcomingTasks(maxDaysLeft, minDaysLeft = -5) {
        const tasks = [];
        const { boards } = this.props;
        boards.forEach(board => {
            board.groups.forEach(group => {
                tasks.push(...group.tasks.filter(task => {
                    const now = Date.now();
                    task.boardId = board._id;
                    task.boardName = board.name;
                    return moment(task.dueDate).isBefore(moment(now).add(maxDaysLeft, 'days'))
                        && moment(now).isAfter(moment(task.dueDate).add(minDaysLeft, 'days'))
                }));
            })
        })
        return tasks;
    }

    getDaysFromNow(date) {
        if (moment(date).isAfter(moment(Date.now()).add(1, 'day').endOf('day'))) {
            console.log('from now:', moment(date).format());
            return moment(date).format('dddd')
        }
        return moment(date).isBefore(moment().endOf('day')) ? 'Today' : 'Tomorrow'
    }

    render() {
        const upcomingTasks = this.getUpcomingTasks(7);
        return (
            <section className="my-week">
                <Navbar />
                <Boardbar /><div className="my-week-container">
                    <div className="my-week-header flex align-center">
                        <h1>My week's schedule</h1>
                        <img src="my-week-calendar.png" alt=""/>
                    </div>
                    {upcomingTasks.length ?
                        <section className="upcoming-tasks-container">
                            <div className="upcoming-tasks">
                                {upcomingTasks.map(task => <div
                                    key={task.id}
                                    className="task-preview space-between align-center padding-x-15">
                                    <div>
                                        <h2>{task.name}</h2>
                                        <p className="task-location">Board: <span onClick={() => this.props.history.push(`/board/${task.boardId}`)}>{task.boardName}</span></p>
                                    </div>
                                    <div className={`label-box ${task.status}`}>{task.status}</div>
                                    <div className="user-img-container">
                                        {task.members ? task.members[0].imgUrl ? <img alt="profile" src={task.members[0].imgUrl} /> :
                                            <div className="member-letter">{task.members[0].name.charAt(0).toUpperCase()}</div> : ''}
                                        <div className="task-number-of-imgs"><span>+{task.members.length ? task.members.length : 0}</span></div>
                                    </div>
                                    <h2>{this.getDaysFromNow(task.dueDate)}</h2>
                                </div>)}
                            </div>
                        </section> :
                        <h1 className="no-tasks">No tasks left for this week</h1>
                    }
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

export const MyWeek = connect(mapStateToProps, mapDispatchToProps)(withRouter(_MyWeek));