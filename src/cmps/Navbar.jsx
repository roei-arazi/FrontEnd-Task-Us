import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { FaAd, FaBell, FaCalendar, FaPortrait } from 'react-icons/fa'

<<<<<<< HEAD
class _Navbar extends Component {
    state = {

    }

    componentDidMount() {

    }

    render() {
        return (
            <div>

            </div>
=======
import { Notifications } from './Notifications';
import { IconContext } from 'react-icons/lib';

class _Navbar extends Component {
    state = {
        isNotificationShown: false
    }

    componentDidMount() {
        console.log(Navbar, this.props);
    }

    toggleNotifications = () => {
        this.setState({ isNotificationShown: !this.state.isNotificationShown })
    }

    render() {
        const { isNotificationShown } = this.state
        return (
            <section className="navbar flex column space-between align-center">
                <NavLink to="/">
                <IconContext.Provider value={{ className: 'icon logo' }}>
                    <FaAd />
                </IconContext.Provider>
                </NavLink>
                <ul className="navbar-links flex column space-around">
                    {isNotificationShown && <Notifications />}
                    <IconContext.Provider value={{ className: 'icon' }}>
                        <li onClick={this.toggleNotifications}><FaBell /></li>
                    </IconContext.Provider>
                    <NavLink to="/myweek">
                        <IconContext.Provider value={{ className: 'icon' }}>
                            <li><FaCalendar /></li>
                        </IconContext.Provider>
                    </NavLink>
                    <NavLink to="/user">
                        <IconContext.Provider value={{ className: 'icon' }}>
                            <li><FaPortrait /></li>
                        </IconContext.Provider>
                    </NavLink>
                </ul>
            </section>
>>>>>>> c3c00249c89b22be8306d9fd6ee954f453e61440
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