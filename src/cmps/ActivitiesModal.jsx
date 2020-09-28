import React, { Component, Fragment } from 'react'
import moment from 'moment'
import { AiOutlineClose } from 'react-icons/ai';
import { Fade } from '@material-ui/core';
import { VscListFilter } from 'react-icons/vsc';
import { withRouter } from 'react-router-dom';
import { Activities } from './Activities';

class _ActivitiesModal extends Component {
    state = {
        isOrderReversed: false,
        isFilterOpen: false,
        filterBy: {},
        searchVal: '',
    }
    get activities() {
        const { activityLog } = this.props;
        const { _id } = this.props.loggedUser;
        return [activityLog.filter(activity => activity[_id]), activityLog.filter(activity => !activity[_id])]
    }
    getInitials(fullName) {
        const [firstName, lastName] = fullName.split(' ');
        let initials = firstName.charAt(0).toUpperCase();
        if (lastName) initials += lastName.charAt(0).toUpperCase();
        return initials;
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
    moveToProfile = (userId) => {
        this.props.history.push(`/user/${userId}`)
    }
    getActivityDates() {
        const activities = this.props.activityLog;
        const dates = activities.reduce((acc, activity) => {
            const date = moment(activity.createdAt).format('DD MMM');
            acc[date] = '';
            return acc;
        }, {})
        return Object.keys(dates);
    }
    getActivityMembers() {
        const activities = this.props.activityLog;
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

    render() {
        if (!this.props.activityLog) return <h1>Loading...</h1>
        const { isFilterOpen, filterBy, searchVal } = this.state;
        let [activities, activitiesNotRead] = this.activities;
        const dates = this.getActivityDates();
        const members = this.getActivityMembers();
        activities = this.applyFilter(activities)
        activitiesNotRead = this.applyFilter(activitiesNotRead)
        return (
            <section className="activities flex column">
                <header className="padding-x-15 padding-y-15">
                    <AiOutlineClose onClick={this.props.onToggleActivities} />
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
                                                <div className="filter-list flex justify-center align-center column">
                                                    {members.map((member, idx) => <button
                                                        className={filterBy.member === member ? 'remove-filter-btn' : ''}
                                                        key={idx}
                                                        onClick={() => this.onSetFilter('member', member)}>{member}</button>)}
                                                </div>
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
                            <button onClick={this.props.onClearLog}>Clear Log</button>
                        </div>
                    </div>
                </header>
                <div className="all-activities-container">
                    {/* Activities which are not read */}
                    <Activities getInitials={this.getInitials}
                        activities={activitiesNotRead} moveToProfile={this.moveToProfile}
                    />
                    {/* Activities which are already read */}
                    <Activities type={'activitiesRead'} getInitials={this.getInitials}
                        activities={activities} moveToProfile={this.moveToProfile}
                    />
                </div>
            </section>
        )
    }
}
export const ActivitiesModal = withRouter(_ActivitiesModal)