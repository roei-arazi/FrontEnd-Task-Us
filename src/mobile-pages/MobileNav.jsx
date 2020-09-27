import React from 'react'
import { NavLink } from 'react-router-dom';
import { GiHamburgerMenu } from 'react-icons/gi'
import { CgProfile } from 'react-icons/cg';
import { BiLogOut } from 'react-icons/bi';
import { FaRegUser } from 'react-icons/fa';
import { BsCalendar, BsCardList } from 'react-icons/bs';
import { MdNotificationsActive } from 'react-icons/md';
import { AiOutlineHome } from 'react-icons/ai';


export class MobileNav extends React.Component {

    state = {
        isMenuShown: false
    }

    toggleMenuModal = () => {
        this.setState({ isMenuShown: !this.state.isMenuShown })
    }

    closeMenuModal = () => {
        this.setState({ isMenuShown: false })
    }

    render() {
        const { loggedUser, params, members, boardName } = this.props
        return (
            <React.Fragment>
                <nav className=" flex align-center space-between">
                    <div className="mobile-nav-left flex">

                    <GiHamburgerMenu onClick={this.toggleMenuModal} />
                    <h1>{boardName ? boardName : loggedUser.fullName}</h1>
                    </div>

                    {boardName &&
                        <div className="board-users-container flex">

                            {members.length === 0 && <div className="user-img-container"> <CgProfile /></div>}
                            {members.length !== 0 && members.map((member, idx) => {
                                return <div key={idx} className="user-img-container">
                                    {
                                        member.imgUrl ? <img className="member-img" src={member.imgUrl} alt="" />
                                            :
                                            <img src="https://www.flaticon.com/svg/static/icons/svg/847/847969.svg" alt="" />

                                    }
                                </div>
                            })}
                        </div>
                    }


                </nav>
                <section className={`${this.state.isMenuShown && 'animate-menu-modal'} menu-modal flex column align-center`}>
                    <NavLink to="/">
                        <AiOutlineHome />  <h3>Home</h3>
                    </NavLink>
                    <NavLink to="/boards">
                        <BsCardList /> <h3>Boards List</h3>
                    </NavLink>
                    {params && <NavLink to={`/mob-activities/${params.id}`}>
                        <MdNotificationsActive /> <h3>Activities</h3>
                    </NavLink>}
                    <NavLink to="/myweek">
                        <BsCalendar /> <h3>My Week</h3>
                    </NavLink>
                    <NavLink to={`/user/${loggedUser._id}`}>
                        <FaRegUser /> <h3>My Profile</h3>
                    </NavLink>
                    <NavLink to="/login">
                        <BiLogOut /> <h3>Logout</h3>
                    </NavLink>
                </section>
                {this.state.isMenuShown && <div className="modal-screen-wrapper" onClick={this.closeMenuModal}></div>}
            </React.Fragment>
        )
    }
}