import React, { Component, Fragment } from 'react'
import moment from 'moment'
import { AiOutlineClose } from 'react-icons/ai';
import { Fade } from '@material-ui/core';
import { VscListFilter } from 'react-icons/vsc';
import { IoIosArrowDropdown } from 'react-icons/io';
import { withRouter } from 'react-router-dom';


class _Activities extends Component {

    state = {
        isOrderReversed: false,
        isFilterOpen: false,
        filterBy: {},
        searchVal: '',
        isActivitiesShown: true,
        isActivitiesNotReadShown: true
    }

    get activities() {
        const { activityLog } = this.props;
        const {_id} = this.props.loggedUser;
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

    moveToProfile = (userId) =>{
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
    toggleActivities = () => {
        this.setState({ isActivitiesShown: !this.state.isActivitiesShown })

    }
    toggleActivitiesNotRead = () => {
        this.setState({ isActivitiesNotReadShown: !this.state.isActivitiesNotReadShown })
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
                    {/* Activities which are not read: */}
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
                                        {activity.byUser.imgUrl ? <img onClick={() => this.moveToProfile(activity.byUser._id)} src={activity.byUser.imgUrl} alt="" />:
                                        <div onClick={() => this.moveToProfile(activity.byUser._id)} className="member-letter flex align-center justify-center">{this.getInitials(activity.byUser.fullName)}</div>}
                                        <h2 onClick={() => this.moveToProfile(activity.byUser._id)}>{activity.byUser.fullName}</h2>
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
                    {/* Activities which are already read */}
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
                                            {activity.byUser.imgUrl ? <img onClick={() => this.moveToProfile(activity.byUser._id)} src={activity.byUser.imgUrl} alt="" />:
                                        <div onClick={() => this.moveToProfile(activity.byUser._id)} className="member-letter flex align-center justify-center">{this.getInitials(activity.byUser.fullName)}</div>}
                                            <h2 onClick={() => this.moveToProfile(activity.byUser._id)}>{activity.byUser.fullName}</h2>
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

export default withRouter(_Activities)