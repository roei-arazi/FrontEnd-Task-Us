import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Boardbar } from '../cmps/Boardbar';
import { loadBoards } from '../store/actions/boardActions'
import { Navbar } from '../cmps/Navbar';
import moment from 'moment'
import { withRouter } from 'react-router-dom';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { Tooltip, Zoom } from '@material-ui/core';

class _MyWeek extends Component {
    state = {
        searchVal: '',
        isOrderReversed: false
    }

    componentDidMount() {
        if (!this.props.boards || !this.props.boards.length) {
            this.props.loadBoards();
        }

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
        tasks.sort((task1, task2) => {
            const res = this.state.isOrderReversed ? -1 : 1;
            if (task1.dueDate < task2.dueDate) return -res;
            if (task1.dueDate > task2.dueDate) return res;
            return 0;
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

    handleChange = ({ target }) => {
        this.setState({ searchVal: target.value })
    }

    reverseOrder = () => {
        this.setState({ isOrderReversed: !this.state.isOrderReversed })
    }

    moveToUserProfile = (userId) => {
        this.props.history.push(`/user/${userId}`)
    }

    render() {
        let upcomingTasks = this.getUpcomingTasks(7);
        const { searchVal, isOrderReversed } = this.state;
        const firstName = this.props.loggedUser.fullName.split(' ')[0]
        if (searchVal) upcomingTasks = upcomingTasks.filter(task => task.name.toLowerCase().includes(searchVal.toLocaleLowerCase()))
        return (
            <section className="my-week flex">
                <Navbar />
                <Boardbar /><div className="my-week-container flex column space around">
                    <div className="my-week-header flex column space-around">
                        <div className="flex align-center space-around">
                            <img src="my-week-calendar.png" alt="" />
                            <section className="greeting-container">
                                <h1>{`Hey ${firstName},`}</h1>
                                <h1>Welcome to My Week</h1>
                            </section>
                        </div>
                    </div>
                    <div className="search-container flex space-between align-center">
                        <h2>Upcoming:</h2>
                        <input onChange={this.handleChange} value={searchVal} type="text" placeholder="search" />
                        {isOrderReversed ?
                            <Tooltip enterDelay={200} TransitionComponent={Zoom} title="Order by date" arrow>
                                <div><FaArrowUp size="1.5rem" onClick={this.reverseOrder} /></div>
                            </Tooltip> :
                            <Tooltip enterDelay={200} TransitionComponent={Zoom} title="Order by date" arrow>
                                <div><FaArrowDown size="1.5rem" onClick={this.reverseOrder} /></div>
                            </Tooltip>
                        }
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
                                    <div className={`label-box ${task.status.toLocaleLowerCase()}`}>{task.status}</div>
                                    <div className="user-img-container">
                                        {task.members ? task.members[0].imgUrl ? <img onClick={() => this.moveToUserProfile(task.members[0]._id)} alt="profile" src={task.members[0].imgUrl} /> :
                                            <div onClick={() => this.moveToUserProfile(task.members[0]._id)} className="member-letter">{task.members[0].name.charAt(0).toUpperCase()}</div> : ''}
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
        boards: state.boardReducer.boards,
        loggedUser: state.userReducer.loggedUser
    }
}

const mapDispatchToProps = {
    loadBoards
}

export const MyWeek = connect(mapStateToProps, mapDispatchToProps)(withRouter(_MyWeek));