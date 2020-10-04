import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
// Inside imports
import { Boardbar } from '../cmps/Boardbar';
import { loadBoards } from '../store/actions/boardActions'
import { Navbar } from '../cmps/Navbar';
import { MobileNav } from '../mobile-pages/MobileNav';
import { UpcomingTasks } from '../cmps/my-week-cmps/UpcomingTasks';

class _MyWeek extends Component {
    state = {
        searchVal: '',

    }
    componentDidMount() {
        if (!this.props.boards || !this.props.boards.length) {
            this.props.loadBoards();
        }
    }
    getUpcomingTasks(maxDaysLeft, minDaysLeft = 0) {
        const tasks = [];
        const { boards, loggedUser } = this.props;
        boards.forEach(board => {
            board.groups.forEach(group => {
                tasks.push(...group.tasks.filter(task => {
                    task.boardId = board._id;
                    task.boardName = board.name;
                    task.groupName = group.name;
                    const belongsToUser = task.members.some(member => member._id === loggedUser._id)
                    const isAfter = minDaysLeft ? moment(task.dueDate).isAfter(moment().add(minDaysLeft, 'days').endOf('day')) : true;
                    return moment(task.dueDate).isBefore(moment().add(maxDaysLeft, 'days').startOf('day'))
                        && isAfter && belongsToUser
                }));
            })
        })
        return tasks;
    }
    handleChange = ({ target }) => {
        this.setState({ searchVal: target.value })
    }
    applySearch(tasks, searchVal) {
        return tasks.filter(task => task.name.toLowerCase().includes(searchVal.toLowerCase()))
    }
    toggleTodayTasks = () => {
        this.setState({ isTodayTasksShown: !this.state.isTodayTasksShown })

    }
    toggleUpcomingTasks = () => {
        this.setState({ isUpcomingTasksShown: !this.state.isUpcomingTasksShown })
    }
    render() {
        let todaysTasks = this.getUpcomingTasks(1);
        let upcomingTasks = this.getUpcomingTasks(7, 1);
        const { searchVal } = this.state;
        const firstName = this.props.loggedUser.fullName.split(' ')[0]
        const taskCount = todaysTasks.length + upcomingTasks.length;
        if (searchVal) {
            todaysTasks = this.applySearch(todaysTasks, searchVal)
            upcomingTasks = this.applySearch(upcomingTasks, searchVal)
        }
        return (
            <section className="my-week flex">
                {
                    window.innerWidth > 600 ?
                        <React.Fragment>
                            <Navbar />
                            <Boardbar />
                        </React.Fragment>
                        :
                        <MobileNav loggedUser={this.props.loggedUser} />
                }
                <div className="my-week-container flex column space around">
                    <div className="my-week-header flex column space-around">
                        <div className="flex align-center space-around">
                            <img src="my-week-calendar.png" alt="" />
                            <section className="greeting-container">
                                <h1>{`Hey ${firstName},`}
                                    {taskCount ? `You have ${taskCount} assignments this week.` : 'You have no assignments this week'}</h1>
                            </section>
                        </div>
                    </div>
                    <input className="task-search" onChange={this.handleChange} value={searchVal} type="text" placeholder="search" />
                    {taskCount ?
                        <Fragment>
                            <UpcomingTasks header="Today" tasks={todaysTasks} />
                            <UpcomingTasks header="Upcoming" tasks={upcomingTasks} />
                        </Fragment> :
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
export const MyWeek = connect(mapStateToProps, mapDispatchToProps)(_MyWeek);