import React, { Component } from 'react'
import moment from 'moment'
import { Fade } from '@material-ui/core';
import Truncate from 'react-truncate';
import { AiOutlineDelete } from 'react-icons/ai';

export class Notifications extends Component {

    state = {
        isModalOpen: null
    }

    componentDidMount() {
        this.setState({ isModalOpen: true })
    }
    onRemoveNotifications = () => {
        this.props.removeNotifications(this.props.loggedUser)
        this.setState({ isModalOpen: true })
    }

    render() {
        const { loggedUser } = this.props;
        return (

            <Fade in={this.state.isModalOpen}>
                <section className="notifications padding-x-15 padding-y-15">
                    <header className="flex space-between align-center">
                        <h1>Notifications</h1>
                        <AiOutlineDelete onClick={this.onRemoveNotifications} />
                    </header>
                    <div className="notifications-container">
                        {
                            loggedUser.notifications &&


                            loggedUser.notifications.map((notification, idx) => {
                                return (
                                    <div key={idx} className="notification flex ">
                                        <div className="user-img-container">
                                            <img src={notification.byUser.imgUrl} alt="profile" />
                                        </div>
                                        <div className="notification-msg flex align-center column">
                                            <h2>
                                                <Truncate lines={1} ellipsis={"..."} width={350}>
                                                    {notification.byUser.fullName}
                                                </Truncate>
                                            </h2>
                                            <p>
                                                <Truncate lines={1} ellipsis={"..."} width={350}>
                                                    {notification.content}
                                                </Truncate>
                                            </p>
                                            <div>
                                                <p>{moment(notification.createdAt).fromNow()}</p>
                                            </div>
                                        </div>
                                    </div>
                                )

                            })

                        }
                    </div>
                </section>
            </Fade>
        )
    }
}

