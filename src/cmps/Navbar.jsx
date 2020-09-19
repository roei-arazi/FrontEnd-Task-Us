import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { FaAd, FaPortrait } from 'react-icons/fa'
import { IoIosNotificationsOutline } from 'react-icons/io'
import { BsCalendar } from 'react-icons/bs'
import { CgProfile } from 'react-icons/cg'
import { Notifications } from './Notifications';

class _Navbar extends Component {
    state = {
        isNotificationShown: false
    }

    toggleNotifications = () => {
        this.setState({ isNotificationShown: !this.state.isNotificationShown })
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
                        {isNotificationShown && <Notifications loggedUser={this.props.loggedUser} />}
                        <IoIosNotificationsOutline onClick={this.toggleNotifications} />
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

}

export const Navbar = connect(mapStateToProps, mapDispatchToProps)(_Navbar);