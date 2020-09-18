import React, { Component } from 'react'
//FOR NOW USING HARDCODED FROM USER SERVICE
//TODO: 
// change from this file to the global state
import { userService } from "../services/userService";
import { Fade } from '@material-ui/core';
import { MdDeleteSweep } from 'react-icons/md';
export class Notifications extends Component {

    state = {
        users: null,
        isModalOpen: null
    }

    async componentDidMount() {
        const users = await userService.loadUsers()
        console.log('USERS', users)
        this.setState({ users, isModalOpen: true })
    }

    render() {
        if (!this.state.users) return <h1>Loading...</h1>
        return (

            <Fade in={this.state.isModalOpen}>
                <section className="notifications padding-x-15 padding-y-15">
                    <header className="flex space-between align-center">
                        <h1>Notifications</h1>
                        <MdDeleteSweep />
                    </header>
                    {/* TODO: change the map */}
                    <div className="notifications-container">
                        {this.state.users.map(user => {
                            return (
                                <div className="notification flex ">
                                    <div className="user-img-container">
                                        <img src={user.imgUrl} alt="profile" />
                                    </div>
                                    <div className="notification-msg flex align-center column">
                                        <div>
                                            <h2>{user.name}</h2>
                                        </div>
                                        <div>
                                            <p>{user.name} changed something</p>
                                        </div>
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

