import React, { Component } from 'react'
import moment from 'moment'
import { AiOutlineClose } from 'react-icons/ai';
import { Fade } from '@material-ui/core';


export default class Activities extends Component {

    state = {
        isOrderReversed: false,
        isFilterOpen: false,
        filterBy: {},
        searchVal: ''
    }

    get activities() {
        const { activityLog } = this.props;
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
            return activity.description.toLowerCase().includes(searchVal)
                || activity.byUser.fullName.toLowerCase().includes(searchVal)
        })
        return res;
    }
    // onClearLog = () => {
    //     const activityLog = this.props.activityLog.filter(activity => null)
    //     console.log('activityLog', activityLog)
    //     this.props.clearLog(activityLog)
    // }

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

                    <div className='filters-container  flex align-center'>
                        <input value={searchVal} onChange={this.handleChange} type="text" placeholder="Search" />

                        <div className="filter-outer-container relative">
                            <button onClick={this.toggleFilter}>Filter</button>
                            {isFilterOpen && <Fade in={true}>
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
                                        <div className="filter-list">
                                            {dates.map((date, idx) => <button
                                                className={filterBy.date === date ? 'remove-filter-btn' : ''}
                                                key={idx}
                                                onClick={() => this.onSetFilter('date', date)}>{date}</button>)}
                                        </div>
                                    </section>
                                </div>
                            </Fade>}
                        </div>
                    </div>
                    <button onClick={this.props.onClearLog}>Clear Log</button>
                </header>
                <div className="all-activities-container">
                    {activitiesNotRead.length !== 0 && (
                        <div className="activity-list-not-read column flex  padding-y-15">
                            <h1>New Activities</h1>
                            {activitiesNotRead.map((activity, idx) => {

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

                        </div>

                    )}

                    <div className="activity-list column flex  padding-y-15">
                        <h1>Activities Read</h1>
                        {activities.map((activity, idx) => {

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
                        })}

                    </div>

                </div>

            </section>
        )
    }
}
