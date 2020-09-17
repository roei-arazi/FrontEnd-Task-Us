import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { FaAd, FaBell, FaCalendar, FaPortrait } from 'react-icons/fa'

import { Notifications } from './Notifications';

class _Navbar extends Component {
    state = {
        isNotificationShown: false
    }

    componentDidMount() {

    }

    toggleNotifications = () => {
        this.setState({ isNotificationShown: !this.state.isNotificationShown })
    }

    render() {
        const { isNotificationShown } = this.state
        return (
            <section className="navbar flex column space-between align-center padding-y-15">
                <NavLink to="/">
                    <FaAd />
                </NavLink>
                <ul className="navbar-links flex column space-around">
                    {isNotificationShown && <Notifications />}
                    <li onClick={this.toggleNotifications}><FaBell /></li>
                    <NavLink to="/myweek">
                        <li><FaCalendar /></li>
                    </NavLink>
                    <NavLink to="/user/123">
                        <li><FaPortrait /></li>
                    </NavLink>
                </ul>
            </section>
        )
    }
}

const mapStateToProps = state => {
    return {

    }
}

const mapDispatchToProps = {

}

export const Navbar = connect(mapStateToProps, mapDispatchToProps)(_Navbar);