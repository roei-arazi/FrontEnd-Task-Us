import React, { Component, Fragment } from 'react'
import moment from 'moment'
import { AiOutlineClose } from 'react-icons/ai';
import { Fade } from '@material-ui/core';
import { VscListFilter } from 'react-icons/vsc';
import { IoIosArrowDropdown } from 'react-icons/io';
import { connect } from 'react-redux';
// inside imports
import { loadBoards, updateBoard } from '../store/actions/boardActions'
import { NavLink } from 'react-router-dom';


export class _mobActivities extends Component {
    state = {
        isOrderReversed: false,
        isFilterOpen: false,
        filterBy: {},
        searchVal: '',
        isActivitiesShown: true,
        isActivitiesNotReadShown: true
    }
    async componentDidMount() {
        try {
            if (!this.props.boards || !this.props.boards.length) {
                await this.props.loadBoards();
            }
        } catch (err) {
            console.log('Error', err)
        }
        this.getBoardById(this.props.match.params.id)
    }
    getBoardById = (id) => {
        const board = this.props.boards.find(board => board._id === id)
        this.setState({ ...this.state, board })
    }
    get activities() {
        const { activityLog } = this.state.board;
        return [activityLog.filter(activity => activity.isRead), activityLog.filter(activity => !activity.isRead)]
    }
    handleChange = ({ target }) => {
        this.setState({ searchVal: target.value })
    }
    toggleFilter = () => {
        this.setState({ isFilterOpen: !this.state.isFilterOpen });
    }
    onSetFilter(key, value) {
        const filterBy = { ...this.state.filterBy }
        if (filterBy[key] === value) value = '';
        this.setState({ filterBy: { ...filterBy, [key]: value } })
    }
    getActivityDates() {
        const activities = this.state.board.activityLog;
        const dates = activities.reduce((acc, activity) => {
            const date = moment(activity.createdAt).format('DD MMM');
            acc[date] = '';
            return acc;
        }, {})
        return Object.keys(dates);
    }
    getActivityMembers() {
        const activities = this.state.board.activityLog;
        const members = activities.reduce((acc, activity) => {
            acc[activity.byUser.fullName] = '';
            return acc;
        }, {})
        return Object.keys(members)
    }
    applyFilter(activities) {
        let res = [...activities];
        const { filterBy, searchVal } = this.state;
        if (filterBy.date) res = res.filter(activity => moment(activity.createdAt).format('DD MMM') === filterBy.date);
        if (filterBy.member) res = res.filter(activity => activity.byUser.fullName === filterBy.member)
        if (searchVal) res = res.filter(activity => {
            return activity.desc.toLowerCase().includes(searchVal)
                || activity.byUser.fullName.toLowerCase().includes(searchVal)
        })
        return res;
    }
    toggleActivities = () => {
        this.setState({ isActivitiesShown: !this.state.isActivitiesShown })
    }
    toggleActivitiesNotRead = () => {
        this.setState({ isActivitiesNotReadShown: !this.state.isActivitiesNotReadShown })
    }
    onClearLog = () => {
        const board = {
            ...this.state.board,
            activityLog: []
        }
        this.setState({ board }, () => {
            this.props.updateBoard(board)
        })
    }
    render() {
        if (!this.state.board) return <h1>Loading...</h1>
        const { isFilterOpen, filterBy, searchVal } = this.state;
        let [activities, activitiesNotRead] = this.activities;
        const dates = this.getActivityDates();
        const members = this.getActivityMembers();
        activities = this.applyFilter(activities)
        activitiesNotRead = this.applyFilter(activitiesNotRead)
        return (
            <section className="activities flex column">
                <header className="padding-x-15 padding-y-15">
                    <NavLink to={`/board/${this.props.match.params.id}`}>
                        <AiOutlineClose />
                    </NavLink>
                    <h1><span>{this.props.boardName}</span> Log</h1>
                    <div className='filters-container space-between flex align-center'>
                        <input value={searchVal} onChange={this.handleChange} type="text" placeholder="Search" />
                        <div className="filter-outer-container flex relative">
                            <button className="flex align-center" onClick={this.toggleFilter}><VscListFilter /> Filter</button>
                            {isFilterOpen &&
                                <Fragment>
                                    <div className="modal-screen-wrapper" onClick={this.toggleFilter}></div>
                                    <Fade in={true}>
                                        <div className="filter-modal flex absolute">
                                            <section className="activity-member-filter">
                                                <h3>Member</h3>
                                                {members.map((member, idx) => <button
                                                    className={filterBy.member === member ? 'remove-filter-btn' : ''}
                                                    key={idx}
                                                    onClick={() => this.onSetFilter('member', member)}>{member}</button>)}
                                            </section>
                                            <section className="activity-date-filter">
                                                <h3>Date</h3>
                                                <div className="filter-list flex justify-center align-center column">
                                                    {dates.map((date, idx) => <button
                                                        className={filterBy.date === date ? 'remove-filter-btn' : ''}
                                                        key={idx}
                                                        onClick={() => this.onSetFilter('date', date)}>{date}</button>)}
                                                </div>
                                            </section>
                                        </div>
                                    </Fade>
                                </Fragment>
                            }
                            <button onClick={this.onClearLog}>Clear Log</button>
                        </div>
                    </div>
                </header>
                <div className="all-activities-container">
                    <div className="activity-list-not-read column flex  padding-y-15">
                        <h1 className="flex space-between">
                            New Activities ({activitiesNotRead.length})
                         <IoIosArrowDropdown className={this.state.isActivitiesNotReadShown ? " toggle-btn rotate0" : " toggle-btn rotate90"} onClick={this.toggleActivitiesNotRead} />
                        </h1>
                        {this.state.isActivitiesNotReadShown && activitiesNotRead.length !== 0 && activitiesNotRead.map((activity, idx) => {
                            return (
                                <div key={idx} className="activity flex align-center padding-y-15 ">
                                    <div className="user-img-container flex align-center">
                                        <div className="date-container">
                                            <p className="date-created">
                                                {moment(activity.createdAt).format("DD MMM")}
                                            </p>
                                        </div>
                                        <img src={activity.byUser.imgUrl} alt="" />
                                        <h2>{activity.byUser.fullName}</h2>
                                    </div>
                                    <div className="activity-desc-container flex align-center">
                                        <p>
                                            {activity.desc}
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                        {activitiesNotRead.length === 0 &&
                            <h3 className="padding-x-15">No new board activities!</h3>
                        }
                    </div>
                    <div className="activity-list column flex  padding-y-15">
                        <h1 className="flex space-between">
                            Activities Read ({activities.length})
                        <IoIosArrowDropdown onClick={this.toggleActivities} className={this.state.isActivitiesShown ? "toggle-btn rotate0" : "toggle-btn rotate90"} />
                        </h1>
                        {
                            this.state.isActivitiesShown && activities.length !== 0 && activities.map((activity, idx) => {
                                return (
                                    <div key={idx} className="activity  space-between flex align-center padding-y-15 ">
                                        <div className="user-img-container flex align-center">
                                            <div className="date-container">
                                                <p className="date-created">
                                                    {moment(activity.createdAt).format("DD MMM")}
                                                </p>
                                            </div>
                                            <img src={activity.byUser.imgUrl} alt="" />
                                            <h2>{activity.byUser.fullName}</h2>
                                        </div>
                                        <div className="activity-desc-container flex align-center">
                                            <p>
                                                {activity.desc}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })
                        }
                        {activities.length === 0 &&
                            <h3 className="padding-x-15">No read board activities!</h3>
                        }
                    </div>
                </div>
            </section>
        )
    }
}
const mapStateToProps = state => {
    return {
        boards: state.boardReducer.boards,
    }
}
const mapDispatchToProps = {
    loadBoards,
    updateBoard
}
export const mobActivities = connect(mapStateToProps, mapDispatchToProps)(_mobActivities);