import React, { Component, Fragment } from 'react'
import moment from 'moment'
import { Fade } from '@material-ui/core';
import { VscListFilter } from 'react-icons/vsc';
import { connect } from 'react-redux';
// inside imports
import { loadBoards, updateBoard } from '../store/actions/boardActions'
import { NavLink } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { Activities } from '../cmps/Activities';


export class _MobActivitiesModal extends Component {
    state = {
        isOrderReversed: false,
        isFilterOpen: false,
        filterBy: {},
        searchVal: '',
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

    onClearLog = () => {
        const board = {
            ...this.state.board,
            activityLog: []
        }
        this.setState({ board }, () => {
            this.props.updateBoard(board)
        })
    }

    getInitials(fullName) {
        const [firstName, lastName] = fullName.split(' ');
        let initials = firstName.charAt(0).toUpperCase();
        if (lastName) initials += lastName.charAt(0).toUpperCase();
        return initials;
    }

    moveToProfile = (userId) => {
        this.props.history.push(`/user/${userId}`)
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
                        <FaArrowLeft className="go-back-arrow" />
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

                    <Activities getInitials={this.getInitials}
                        activities={activitiesNotRead} moveToProfile={this.moveToProfile} />

                    <Activities type={'activitiesRead'} getInitials={this.getInitials}
                        activities={activities} moveToProfile={this.moveToProfile} />

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
export const MobActivitiesModal = connect(mapStateToProps, mapDispatchToProps)(_MobActivitiesModal);