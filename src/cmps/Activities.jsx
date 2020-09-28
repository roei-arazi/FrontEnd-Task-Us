import React, { Component, Fragment } from 'react'
import moment from 'moment'
import { IoIosArrowDropdown } from 'react-icons/io'

export class Activities extends Component {

    state = {
        isShown: true,
    }
    toggleIsShown = () => {
        this.setState({ isShown: !this.state.isShown })

    }

    render() {
        const { type, activities, getInitials, moveToProfile } = this.props
        return (
            <div className={
                `${type === 'activitiesRead'
                    ? 'activity-list'
                    : 'activity-list-not-read'}
                     column flex  padding-y-15`}>

                <h1 className="flex space-between">
                    <Fragment>
                        Activities Read ({activities.length})
                                 <IoIosArrowDropdown
                            onClick={this.toggleIsShown}
                            className={this.state.isShown ? " toggle-btn rotate0" : " toggle-btn rotate90"} />

                    </Fragment>
                </h1>

                {activities.length === 0
                    ? //no activities 
                    (type === 'activitiesRead'
                        ? <h3 className="padding-x-15">No read board activities!</h3>

                        : <h3 className="padding-x-15">No new board activities!</h3>

                    )
                    : this.state.isShown && // found activities
                    activities.map((activity, idx) => {
                        return (
                            <div key={idx} className="activity flex align-center padding-y-15 ">
                                <div className="user-img-container flex align-center">
                                    <div className="date-container">
                                        <p className="date-created">
                                            {moment(activity.createdAt).format("DD MMM")}
                                        </p>
                                    </div>
                                    {activity.byUser.imgUrl ? <img className="cursor-pointer" onClick={() => moveToProfile(activity.byUser._id)} src={activity.byUser.imgUrl} alt="" /> :
                                        <div onClick={() => moveToProfile(activity.byUser._id)} className="member-letter flex align-center justify-center">{getInitials(activity.byUser.fullName)}</div>}
                                    <h2 onClick={() => moveToProfile(activity.byUser._id)}>{activity.byUser.fullName}</h2>
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


            </div>
        )
    }
}
