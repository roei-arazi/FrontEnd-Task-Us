import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import { FaRegUser } from 'react-icons/fa'
import { VscBell, VscBellDot } from 'react-icons/vsc'
import { BsCalendar } from 'react-icons/bs'
import { BiLogOut } from 'react-icons/bi'
// inside imports
import { Notifications } from './Notifications';
import { markAsRead, removeNotifications, logout } from '../store/actions/userActions'

class _Navbar extends Component {
    state = {
        isNotificationShown: false
    }
    toggleNotifications = () => {
        this.onMarkAsRead()
        this.setState({ isNotificationShown: !this.state.isNotificationShown })
    }
    onMarkAsRead = () => {
        this.props.markAsRead(this.props.loggedUser)
    }
    onLogout = () => {
        this.props.logout()
        this.props.history.push('/login')
    }
    goToUserProfile = (id) => {
        this.props.history.push(`/user/${id}`)
    }
    render() {
        const { isNotificationShown } = this.state
        const { loggedUser, removeNotifications } = this.props
        return (
            <section className="navbar flex column space-between align-center padding-y-15">
                <ul className="navbar-links flex column space-around">
                    <NavLink to="/">
                        <img className="logo-navbar" src="taskus-nav.png" alt="" />
                    </NavLink>
                    {isNotificationShown && <div className="modal-screen-wrapper" onClick={this.toggleNotifications} />}
                    <li className="icon-container cursor-pointer" onClick={!this.state.isNotificationShown ? this.toggleNotifications : () => { }} >
                        {
                            loggedUser.notifications.filter(notification => !notification.isRead).length === 0
                                ? ''
                                : <div className="notifications-counter">
                                    <p >
                                        {loggedUser.notifications.filter(notification => !notification.isRead).length}
                                    </p>
                                </div>
                        }
                        {
                            isNotificationShown &&
                            <Notifications goToUserProfile={this.goToUserProfile} removeNotifications={removeNotifications} loggedUser={loggedUser} />
                        }
                        {loggedUser.notifications.some(notification => !notification.isRead)
                            ? <VscBellDot />
                            : <VscBell />}
                    </li>
                </ul>
                <ul className="navbar-links flex column space-around">
                    <NavLink to={loggedUser ? "/myweek" : '/login'}>
                        <li className="icon-container"><BsCalendar /></li>
                    </NavLink>
                    <NavLink to={loggedUser ? `/user/${loggedUser._id}` : '/login'}>
                        <li className="icon-container"><FaRegUser /></li>
                    </NavLink>
                    <li className="icon-container" ><BiLogOut onClick={this.onLogout} /></li>
                </ul>
            </section>
        )
    }
}
const mapStateToProps = state => {
    return {
        loggedUser: state.userReducer.loggedUser
    }
}
const mapDispatchToProps = {
    markAsRead,
    removeNotifications,
    logout
}
export const Navbar = connect(mapStateToProps, mapDispatchToProps)(withRouter(_Navbar));