import React, { Component } from 'react'
import moment from 'moment'
import Truncate from 'react-truncate';
import { Tooltip, Zoom } from '@material-ui/core';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { AiOutlineClose } from 'react-icons/ai';


export default class Activities extends Component {

    state = {
        isOrderReversed: false,
        filteredActivities: ''
    }

    componentDidMount() {
        this.setState({ filteredActivities: this.props.activityLog })
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
        const { isOrderReversed, filteredActivities } = this.state;
        return (
            <section className="activities flex column padding-y-15">

                <header className="padding-x-15">

                    <AiOutlineClose onClick={this.props.onToggleActivities} />
                    <h1><span>{this.props.boardName}</span> Log</h1>

                    <div className='filters-container space-between flex align-center'>
                        <input onChange={this.handleSearch} type="text" placeholder="Search" />
                        {isOrderReversed ?
                            <Tooltip enterDelay={200} TransitionComponent={Zoom} title="Order by date" arrow>
                                <div><FaArrowUp size="1.5rem" onClick={this.reverseOrder} /></div>
                            </Tooltip> :
                            <Tooltip enterDelay={200} TransitionComponent={Zoom} title="Order by date" arrow>
                                <div><FaArrowDown size="1.5rem" onClick={this.reverseOrder} /></div>
                            </Tooltip>
                        }
                    </div>

                </header>


                <div className="activity-list column flex ">
                    {filteredActivities.map(activity => {

                        return (
                            <div key={activity.id} className="activity padding-x-15 space-between flex align-center">
                                <div className="activity-desc-container flex align-center">
                                    <div className="user-img-container flex align-center justify-center">
                                        <img src={activity.byUser.imgUrl} alt="" />
                                    </div>
                                    <h2>{activity.byUser.fullName}</h2>
                                    <p>
                                        <Truncate lines={1} ellipsis={"..."} width={550}>
                                            {activity.description}
                                        </Truncate>
                                    </p>
                                </div>

                                <p className="date-created">{moment(activity.createdAt).fromNow()}</p>

                            </div>
                        )
                    })}

                </div>

            </section>
        )
    }
}
