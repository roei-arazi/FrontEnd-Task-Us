import React, { Component } from 'react'
import moment from 'moment'
import Truncate from 'react-truncate';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { AiOutlineClose } from 'react-icons/ai';
import { Fade } from '@material-ui/core';


export default class Activities extends Component {

    state = {
        isOrderReversed: false,
        isFilterOpen: false,
        filterBy: {},
        searchVal: ''
    }

    // componentDidMount() {
    //     const activities = this.props.activityLog.filter(activity => activity.isRead)
    //     const activitiesNotRead = this.props.activityLog.filter(activity => !activity.isRead)
    //     this.setState({ activities, activitiesNotRead })
    // }

    getActivities(){
        const {activityLog} = this.props;
        return [activityLog.filter(activity => activity.isRead), activityLog.filter(activity => !activity.isRead)]
    }

    handleSearch = ({ target }) => {
        // const activities = this.props.activityLog.filter((activity) => {
        //     return activity.isRead && (
        //         activity.description.toLowerCase().includes(target.value.toLocaleLowerCase())
        //         ||
        //         activity.byUser.fullName.toLowerCase().includes(target.value.toLocaleLowerCase())
        //     )
        // })

        // const activitiesNotRead = this.props.activityLog.filter((activity) => {
        //     return !activity.isRead && (
        //         activity.description.toLowerCase().includes(target.value.toLocaleLowerCase())
        //         ||
        //         activity.byUser.fullName.toLowerCase().includes(target.value.toLocaleLowerCase())
        //     )
        // })
        // this.setState({ activitiesNotRead, activities })
    }

    handleChange = ({target}) =>{
        this.setState({searchVal: target.value})
    }

    toggleFilter = () => {
        this.setState({ isFilterOpen: !this.state.isFilterOpen });
    }

    onSetFilter(key, value){
        this.setState({filterBy: {...this.state.filterBy, [key]: value}})
    }

    getActivityDates(notRead, read) {
        const activities = [...notRead, ...read];
        const dates = activities.reduce((acc, activity) => {
            const date = moment(activity.createdAt).format('DD MMM');
            acc[date] = '';
            return acc;
        }, {})
        return Object.keys(dates);
    }

    applyFilter(activities){
        let res = [...activities];
        const {filterBy} = this.state;
        if(filterBy.date) res = res.filter(activity => moment(activity.createdAt).format('DD MMM') === filterBy.date);
        return res;
    }

    render() {
        if (!this.props.activityLog) return <h1>Loading...</h1>
        const {isFilterOpen, filterBy, searchVal } = this.state;
        let [activities, activitiesNotRead] = this.getActivities();
        const dates = this.getActivityDates(activitiesNotRead, activities)
        console.log('filtered:', this.applyFilter(activitiesNotRead));
        return (
            <section className="activities flex column padding-y-15">

                <header className="padding-x-15">

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
                </header>
                <div className="all-activities-container padding-y-15 padding-x-15">
                    <div className="activity-list-not-read column flex  padding-y-15 padding-x-15">
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
                                            <Truncate lines={1} ellipsis={"..."} width={550}>
                                                {activity.description}
                                            </Truncate>
                                        </p>
                                    </div>


                                </div>
                            )
                        })}

                    </div>

                    <div className="activity-list column flex  padding-y-15 padding-x-15">
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
                                            <Truncate lines={1} ellipsis={"..."} width={550}>
                                                {activity.description}
                                            </Truncate>
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
