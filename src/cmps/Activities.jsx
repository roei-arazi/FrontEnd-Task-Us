import React, { Component } from 'react'
import moment from 'moment'
import Truncate from 'react-truncate';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { AiOutlineClose } from 'react-icons/ai';


export default class Activities extends Component {

    state = {
        isOrderReversed: false,
        filteredActivities: '',
        filteredActivitiesNotRead: ''
    }

    componentDidMount() {
        const filteredActivities = this.props.activityLog.filter(activity => activity.isRead)
        const filteredActivitiesNotRead = this.props.activityLog.filter(activity => !activity.isRead)
        this.setState({ filteredActivities, filteredActivitiesNotRead })
    }

    handleSearch = ({ target }) => {
        const filteredActivities = this.props.activityLog.filter((activitiy) => {
            return activitiy.description.toLowerCase()
                .includes(target.value.toLocaleLowerCase())
                ||
                activitiy.byUser.fullName.toLowerCase()
                    .includes(target.value.toLocaleLowerCase())
        })
        this.setState({ filteredActivities })
    }

    reverseOrder = () => {
        const filteredActivities = this.state.filteredActivities.sort((activitiy1, activitiy2) => {
            const res = this.state.isOrderReversed ? -1 : 1;
            if (activitiy1.createdAt < activitiy2.createdAt) return -res;
            if (activitiy1.createdAt > activitiy2.createdAt) return res;
            return 0;
        })
        this.setState({ isOrderReversed: !this.state.isOrderReversed })
        this.setState({ filteredActivities })
    }


    render() {
        if (!this.state.filteredActivities) return <h1>Loading...</h1>
        const { isOrderReversed, filteredActivities, filteredActivitiesNotRead } = this.state;
        return (
            <section className="activities flex column padding-y-15">

                <header className="padding-x-15">

                    <AiOutlineClose onClick={this.props.onToggleActivities} />
                    <h1><span>{this.props.boardName}</span> Log</h1>

                    <div className='filters-container space-between flex align-center'>
                        <input onChange={this.handleSearch} type="text" placeholder="Search" />
                        {isOrderReversed ?
                            <div data-title="Sort"><FaArrowUp size="1.5rem" onClick={this.reverseOrder} /></div>
                            :
                            <div data-title="Sort"><FaArrowDown size="1.5rem" onClick={this.reverseOrder} /></div>
                        }
                    </div>

                </header>
                <div className="activity-list-not-read column flex padding-y-15 padding-x-15 ">
                    <h1>New Activities</h1>
                    {filteredActivitiesNotRead.map((activity, idx) => {

                        return (
                            <div key={idx} className="activity  space-between flex align-center padding-y-15 ">
                                <div className="user-img-container flex align-center justify-center">
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
                                <div className="date-container">
                                    <p className="date-created">{moment(activity.createdAt).fromNow()}</p>
                                </div>

                            </div>
                        )
                    })}

                </div>

                <div className="activity-list column flex  padding-y-15 padding-x-15">
                    <h1>Activities Read</h1>
                    {filteredActivities.map((activity, idx) => {

                        return (
                            <div key={idx} className="activity  space-between flex align-center padding-y-15 ">
                                <div className="user-img-container flex align-center justify-center">
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
                                <div className="date-container">
                                    <p className="date-created">{moment(activity.createdAt).fromNow()}</p>
                                </div>

                            </div>
                        )
                    })}

                </div>



            </section>
        )
    }
}
