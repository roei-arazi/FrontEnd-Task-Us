import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Boardbar } from '../cmps/Boardbar';
import { loadBoards } from '../store/actions/boardActions'
import { Navbar } from '../cmps/Navbar';
import moment from 'moment'
import { withRouter } from 'react-router-dom';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { Tooltip, Zoom } from '@material-ui/core';
import { UpcomingTasks } from '../cmps/my-week-cmps/UpcomingTasks';

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

    getUpcomingTasks(maxDaysLeft, minDaysLeft = 0) {
        console.log('maxDaysLeft:', maxDaysLeft);
        console.log('minDaysLeft:', minDaysLeft);
        const tasks = [];
        const { boards, loggedUser } = this.props;
        boards.forEach(board => {
            board.groups.forEach(group => {
                tasks.push(...group.tasks.filter(task => {
                    task.boardId = board._id;
                    task.boardName = board.name;
                    task.groupName = group.name;
                    const isAfter = minDaysLeft ? moment(task.dueDate).isAfter(moment().add(minDaysLeft, 'days').endOf('day')) : true;
                    console.log('isAfter:', isAfter);
                    console.log('check:', moment(task.dueDate).isAfter(moment().add(minDaysLeft, 'days').endOf('day')));
                    return moment(task.dueDate).isBefore(moment().add(maxDaysLeft, 'days').startOf('day'))
                        && isAfter
                        // && task.members.some(member => member._id === loggedUser._id)
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



    handleChange = ({ target }) => {
        this.setState({ searchVal: target.value })
    }

    reverseOrder = () => {
        this.setState({ isOrderReversed: !this.state.isOrderReversed })
    }

    applySearch(tasks, searchVal){
        return tasks.filter(task => task.name.toLowerCase().includes(searchVal.toLocaleLowerCase()))
    }

    render() {
        let todaysTasks = this.getUpcomingTasks(1);
        let upcomingTasks = this.getUpcomingTasks(7, 1);
        const { searchVal, isOrderReversed } = this.state;
        const firstName = this.props.loggedUser.fullName.split(' ')[0]
        if (searchVal){
             todaysTasks = this.applySearch(todaysTasks, searchVal)
             upcomingTasks = this.applySearch(upcomingTasks, searchVal)
            }
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
                        <Fragment>
                            <UpcomingTasks header="Today" tasks={todaysTasks} />
                            <UpcomingTasks header="Upcoming" tasks={todaysTasks} />
                        </Fragment>:
                <h1 className="no-tasks">No tasks left for this week</h1>
                    }
                </div>


            </section >
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