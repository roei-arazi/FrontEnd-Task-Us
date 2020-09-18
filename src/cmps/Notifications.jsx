import React, { Component } from 'react'
//FOR NOW USING HARDCODED FROM USER SERVICE
//TODO: 
// change from this file to the global state
import { userService } from "../services/userService";

export class Notifications extends Component {

    state = {
        users: null
    }

    async componentDidMount() {
        const users = await userService.loadUsers()
        console.log('USERS', users)
        this.setState({ users })
    }

    render() {
        if (!this.state.users) return <h1>Loading...</h1>
        return (
            <section className="notifications">

                <div className="user-img-container">
                    <img src={this.state.users[0].imgUrl} alt="profile" />
                </div>
                {this.state.users[0].name} changed

            </section>
        )
    }
}

