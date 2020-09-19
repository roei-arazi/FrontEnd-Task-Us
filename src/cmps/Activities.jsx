import React, { Component } from 'react'
import moment from 'moment'
import Truncate from 'react-truncate';
export default class Activities extends Component {

    componentDidMount() {
    }
    getDaysFromNow(date) {
        if (moment(date).isAfter(moment(Date.now()).add(1, 'day').endOf('day'))) {
            console.log('from now:', moment(date).format());
            return moment(date).format('dddd')
        }
        return moment(date).isBefore(moment().endOf('day')) ? 'Today' : 'Tomorrow'
    }
    render() {
        const { activityLog } = this.props.board
        return (
            <section className="activities flex column padding-y-15 padding-x-15">
                <header>
                    <button>X</button>
                    <h1><span>{this.props.board.name}</span> Log</h1>
                </header>

                <div className="filters-container flex align-center">
                    <button>FILTER</button>
                    <input placeholder="Search" />
                </div>

                <div className="activity-list column flex ">
                    {activityLog.map(activity => {

                        return (
                            <div key={activity.id} className="activity space-between flex align-center">
                                <div className="activity-desc-container flex align-center">
                                    <div className="user-img-container">
                                        <img src={activity.byUser.imgUrl} alt="" />
                                    </div>
                                    <h2>{activity.byUser.fullName}</h2>
                                    <p>
                                        <Truncate lines={1} ellipsis={"..."} width={250}>
                                            {activity.description}
                                        </Truncate>
                                    </p>
                                </div>

                                <span className="date-created">{this.getDaysFromNow(activity.createdAt)}</span>

                            </div>
                        )
                    })}

                </div>

            </section>
        )
    }
}
