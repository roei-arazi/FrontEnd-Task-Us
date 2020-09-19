import React, { Component } from 'react'
//FOR NOW USING HARDCODED FROM USER SERVICE
//TODO: 
// change from this file to the global state
import { userService } from "../services/userService";
import { Fade } from '@material-ui/core';
import Truncate from 'react-truncate';
import { MdDeleteSweep } from 'react-icons/md';
export class Notifications extends Component {

    state = {
        users: null,
        isModalOpen: null
    }

    async componentDidMount() {
        const users = await userService.loadUsers()
        this.setState({ users, isModalOpen: true })
    }

    render() {
        if (!this.state.users) return <h1>Loading...</h1>
        const {loggedUser} = this.props;
        return (

            <Fade in={this.state.isModalOpen}>
                <section className="notifications padding-x-15 padding-y-15">
                    <header className="flex space-between align-center">
                        <h1>Notifications</h1>
                        <MdDeleteSweep />
                    </header>
                    <div className="notifications-container">
                        {loggedUser.notifications.map((notification, idx)=> {
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
                                                {notification.byUser.fullName + ' ' + notification.content}
                                            </Truncate>
                                        </p>
                                        <div>
                                            <p>a day ago</p>
                                        </div>
                                    </div>
                                </div>
                            )

                        })}
                    </div>
                </section>
            </Fade>
        )
    }
}

