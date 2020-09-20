import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Fade } from '@material-ui/core';
import { NavLink } from 'react-router-dom';
import { FaAd } from 'react-icons/fa'
import { VscBell, VscBellDot } from 'react-icons/vsc'
import { BsCalendar } from 'react-icons/bs'
import { CgProfile } from 'react-icons/cg'
import { Notifications } from './Notifications';
import { markAsRead } from '../store/actions/userActions'
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


    render() {
        const { isNotificationShown } = this.state
        const { loggedUser } = this.props
        return (
            <section className="navbar flex column space-between align-center padding-y-15">

                <ul className="navbar-links flex column space-around">
                    <NavLink to="/">
                        <FaAd />
                    </NavLink>

                    {isNotificationShown && <div className="modal-screen-wrapper" onClick={this.toggleNotifications} />}
                    <div className="icon-container" >
                        {
                            loggedUser.notifications.filter(notification => !notification.isRead).length === 0
                                ? ''
                                : <p className="notifications-counter cursor-pointer">
                                    {loggedUser.notifications.filter(notification => !notification.isRead).length}
                                </p>
                        }
                        {
                            isNotificationShown &&
                            <Fade in={this.state.isNotificationShown}>
                                <Notifications loggedUser={loggedUser} />
                            </Fade>
                        }

                        {loggedUser.notifications.some(notification => !notification.isRead)
                            ? <VscBellDot onClick={this.toggleNotifications} />
                            : <VscBell onClick={this.toggleNotifications} />}
                    </div>
                </ul>

                <ul className="navbar-links flex column space-around">
                    <NavLink to="/myweek">
                        <div className="icon-container"><BsCalendar /></div>
                    </NavLink>
                    <NavLink to={`/user/${loggedUser._id}`}>
                        <li><CgProfile /></li>
                    </NavLink>
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
    markAsRead
}

export const Navbar = connect(mapStateToProps, mapDispatchToProps)(_Navbar);