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
                        {loggedUser.notifications.length !== 0
                            ? (
                                <React.Fragment>
                                    <h1>Notifications</h1>,
                                    <AiOutlineDelete onClick={this.onRemoveNotifications} />
                                </React.Fragment>
                            )
                            : (<h1>You have no notifications.</h1>)}
                    </header>
                    <div className="notifications-container">
                        {
                            loggedUser.notifications && (
                                loggedUser.notifications.map((notification, idx) => {
                                    return (
                                        <div key={idx} className="notification flex ">
                                            <div className="user-img-container">
                                                <img src={notification.byUser.imgUrl} alt="profile" />
                                            </div>
                                            <div className="notification-msg flex align-center column">
                                                <h2>
                                                        {notification.byUser.fullName}
                                                </h2>
                                                <p>
                                                        {notification.content}
                                                </p>
                                                <div>
                                                    <p>{moment(notification.createdAt).fromNow()}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )

                                })
                            )


                        }
                    </div>
                </section>
            </Fade>
        )
    }
}

