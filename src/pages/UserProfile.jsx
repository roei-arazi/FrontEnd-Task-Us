
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Fade } from '@material-ui/core';
import { Boardbar } from '../cmps/Boardbar';
import { Navbar } from '../cmps/Navbar';
import { loadBoards } from '../store/actions/boardActions';
import { userService } from '../services/userService.js';
import { updateUser } from '../store/actions/userActions';
import { cloudinaryService } from '../services/cloudinaryService';
import { MobileNav } from '../mobile-pages/MobileNav';

class _UserProfile extends Component {
    state = {
        isModalOpen: false,
        user: {
            _id: '',
            email: '',
            username: '',
            passowrd: '',
            fullName: '',
            imgUrl: '',
        }
    }

    async componentDidMount() {
        this.props.loadBoards();
        setTimeout(async () => { //for loading extravaganza
            const user = await userService.getUserById(this.props.match.params.id)
            this.setState({ user: { ...user } })
        }, 2000);
    }

    async componentDidUpdate(prevProps) {
        if (prevProps.match.params.id !== this.props.match.params.id) {
            console.log('IM HERE',)

            this.setState({ user: {} }, () => {
                setTimeout(async () => { //for loading extravaganza
                    const user = await userService.getUserById(this.props.match.params.id)
                    this.setState({ user: { ...user } })

                }, 2000)
            });
        }
    }


    toggleModal = () => {
        this.setState({ isModalOpen: !this.state.isModalOpen })
    }

    handleChange = ({ target }) => {
        this.setState({ user: { ...this.state.user, [target.name]: target.value } })
    }

    updateProfile = (ev) => {
        ev.preventDefault()
        this.props.updateUser(this.state.user)
        this.toggleModal()
    }


    uploadImg = async (ev) => {
        const res = await cloudinaryService.uploadImg(ev.target.files[0])
        this.setState({ user: { ...this.state.user, imgUrl: res.url } })
    }

    render() {
        let { email, fullName, username, imgUrl, _id } = this.state.user;
        if (!_id) {
            return (
                <div className="loader-container flex justify-center align-center">
                    <img src='loading.gif' />
                </div>
            )
        }
        const [firstName, lastName] = fullName.split(' ');
        let initials = firstName.charAt(0).toUpperCase();
        if (lastName) initials += lastName.charAt(0).toUpperCase()
        const guestId = '5f6efc73805dbf6054d58794';

        const { loggedUser } = this.props
        console.log('loggedUser id:', loggedUser._id);
        console.log('guest id:', guestId);
        return (

                <section className={`user-profile flex ${window.innerWidth<450 && 'column'}`}>
                {window.innerWidth > 450 ?
                    <React.Fragment>
                        <Navbar />
                        <Boardbar />
                    </React.Fragment>
                    : <MobileNav loggedUser={this.props.loggedUser} />
                }
                    <div className="user-container relative">
                        <header className="header-container padding-x-15 padding-y-15 flex justify-center  align-center">
                            {imgUrl ? <img className="user-profile-big" src={imgUrl} alt="" /> :
                                <div className="user-profile-big flex align-center justify-center">{initials}</div>}
                        </header>

                        <div className="user-details-container padding-x-30 padding-y-45 align-center  flex column">
                            {(loggedUser._id === _id && loggedUser._id !== guestId) ? <h2 onClick={this.toggleModal}
                                className="clickable-header">Edit Profile</h2> : ''}
                            <div className="user-details-inner-container">

                                <h3>Email: <span className="span-user-details">{email}</span></h3>
                                <h3>Full Name: <span className="span-user-details">{fullName}</span></h3>
                                <h3>Username: <span className="span-user-details">{username}</span> </h3>
                            </div>
                        </div>
                        {/* Modal */}
                        <Fade in={this.state.isModalOpen}>
                            <div className="modal-screen flex justify-center align-center">
                                <div className="modal-container absolute">

                                    <div className="user-modal-header padding-x-15 padding-y-15 flex justify-center align-center">


                                        <label> {this.state.user.imgUrl ?
                                            <img className="user-profile-big" src={this.state.user.imgUrl} alt="profile-img" />
                                            : <div>{this.props.loggedUser.fullName}</div>}
                                            <input type="file" onChange={this.uploadImg} hidden />
                                        </label>

                                    </div>
                                    <div className="user-modal-main">
                                        <form className="form-container flex justify-center column  align-center" onSubmit={this.updateProfile}>
                                            <input value={this.state.user.email} onChange={this.handleChange} name="email" placeholder="Email" type="email" />
                                            <input value={this.state.user.username} onChange={this.handleChange} name="username" placeholder="Username" type="text" />
                                            <input value={this.state.user.password} onChange={this.handleChange} name="password" placeholder="Password" type="password" />
                                            <input value={this.state.user.fullName} onChange={this.handleChange} name="fullName" placeholder="Full Name" type="text" />
                                            <button onClick={this.updateProfile}>Save Changes</button>
                                            <button type="button" className="secondary-btn" onClick={this.toggleModal}>Cancel</button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </Fade>


                    </div>
                </section>
        )
    }
}

const mapStateToProps = state => {
    return {
        modal: state.systemReducer.modal,
        loggedUser: state.userReducer.loggedUser,
        boards: state.boardReducer.boards
    }
}

const mapDispatchToProps = {
    loadBoards,
    updateUser
}

export const UserProfile = connect(mapStateToProps, mapDispatchToProps)(_UserProfile);