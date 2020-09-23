import React, { Component } from 'react'
import moment from 'moment'
import Truncate from 'react-truncate';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { AiOutlineClose } from 'react-icons/ai';


export default class Activities extends Component {

    state = {
        isOrderReversed: false,
        activities: '',
        activitiesNotRead: ''
    }

    componentDidMount() {
        const activities = this.props.activityLog.filter(activity => activity.isRead)
        const activitiesNotRead = this.props.activityLog.filter(activity => !activity.isRead)
        this.setState({ activities, activitiesNotRead })
    }

    handleSearch = ({ target }) => {
        const activities = this.props.activityLog.filter((activity) => {
            return activity.isRead && (
                activity.description.toLowerCase().includes(target.value.toLocaleLowerCase())
                ||
                activity.byUser.fullName.toLowerCase().includes(target.value.toLocaleLowerCase())
            )
        })

        const activitiesNotRead = this.props.activityLog.filter((activity) => {
            return !activity.isRead && (
                activity.description.toLowerCase().includes(target.value.toLocaleLowerCase())
                ||
                activity.byUser.fullName.toLowerCase().includes(target.value.toLocaleLowerCase())
            )
        })
        this.setState({ activitiesNotRead, activities })
    }

    // reverseOrder = () => {
    //     const activities = this.state.activities.sort((activity1, activity2) => {
    //         const res = this.state.isOrderReversed ? -1 : 1;
    //         if (activity1.createdAt < activity2.createdAt) return -res;
    //         if (activity1.createdAt > activity2.createdAt) return res;
    //         return 1;
    //     })
    //     const activitiesNotRead = this.state.activitiesNotRead.sort((activity1, activity2) => {
    //         const res = this.state.isOrderReversed ? -1 : 1;
    //         if (activity1.createdAt < activity2.createdAt) return -res;
    //         if (activity1.createdAt > activity2.createdAt) return res;
    //         return 1;
    //     })
    //     this.setState({ isOrderReversed: !this.state.isOrderReversed })
    //     this.setState({ activities, activitiesNotRead })
    // }


    render() {
        if (!this.state.activities) return <h1>Loading...</h1>
        const { isOrderReversed, activities, activitiesNotRead } = this.state;

        return (
            <section className="activities flex column padding-y-15">

                <header className="padding-x-15">

                    <AiOutlineClose onClick={this.props.onToggleActivities} />
                    <h1><span>{this.props.boardName}</span> Log</h1>

                    <div className='filters-container  flex align-center'>
                        <input onChange={this.handleSearch} type="text" placeholder="Search" />
                        {/* {isOrderReversed ?
                            <div data-title="Sort"><FaArrowUp size="1.5rem" onClick={this.reverseOrder} /></div>
                            :
                            <div data-title="Sort"><FaArrowDown size="1.5rem" onClick={this.reverseOrder} /></div>
                        } */}
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
