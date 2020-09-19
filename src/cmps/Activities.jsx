import React, { Component } from 'react'
import moment from 'moment'
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

                <div className="activitiy-list column flex ">
                    {activityLog.map(activitiy => {

                        return (
                            <div key={activitiy.id} className="activitiy space-between flex align-center">
                                <div className="activitiy-desc-container hide-long-txt flex align-center">
                                    <div className="user-img-container">
                                        <img src={activitiy.byUser.imgUrl} alt="" />
                                    </div>
                                    <h2>{activitiy.byUser.fullName}</h2>
                                    <p>{activitiy.description}</p>
                                </div>

                                <span>{this.getDaysFromNow(activitiy.createdAt)}</span>
                            </div>
                        )
                    })}

                </div>

            </section>
        )
    }
}
