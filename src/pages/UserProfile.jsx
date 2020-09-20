
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Fade } from '@material-ui/core';
import { Boardbar } from '../cmps/Boardbar';
import { Navbar } from '../cmps/Navbar';
import { loadBoards } from '../store/actions/boardActions'
import { getUserById, updateProfile } from '../store/actions/userActions';
import { cloudinaryService } from '../services/cloudinaryService';

class _UserProfile extends Component {
    state = {
        isModalOpen: false,
        user: {
            _id: this.props.match.params.id,
            email: '',
            username: '',
            passowrd: '',
            fullName: '',
            imgUrl: ''
        }
    }

    async componentDidMount() {
        this.props.loadBoards()
        await this.props.getUserById(this.props.match.params.id)
        this.setState({ user: { ...this.state.user, imgUrl: this.props.userProfile.imgUrl } })
    }

    async componentDidUpdate(prevProps, prevState) {
        if (prevProps.match.params.id !== this.props.match.params.id) {
            await this.setState({ user: { ...this.state.user, id: this.props.match.params.id } })
            this.props.getUserById(this.props.match.params.id)
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
        this.props.updateProfile(this.state.user)
        this.toggleModal()
    }


    uploadImg = async (ev) => {
        const res = await cloudinaryService.uploadImg(ev)
        this.setState({ user: { ...this.state.user, imgUrl: res.url } })
    }

    render() {
        if (!this.props.userProfile) return <h1>Loading...</h1>
        const { loggedUser, userProfile } = this.props
        const { email, fullName, username, imgUrl } = this.props.userProfile

        return (
            <section className="user-profile">
                <Navbar />
                <Boardbar />
                <div className="user-container">
                    <header className="header-container padding-x-15 padding-y-15 flex justify-center  align-center">
                        <img className="user-profile-big" src={imgUrl} alt="" />
                    </header>

                    <div className="user-details-container padding-x-30 padding-y-45 align-center  flex column">
                        {loggedUser._id === userProfile._id ? <h2 onClick={this.toggleModal}
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
                            <div className="modal-container padding-x-15 padding-y-15">

                                <div className="user-modal-col align-center">


                                    <label> {this.state.user.imgUrl ?
                                        <img className="user-profile-big" src={this.state.user.imgUrl} alt="profile-img" />
                                        : <div>{this.props.loggedUser.fullName}</div>}
                                        <input type="file" onChange={this.uploadImg} hidden />
                                    </label>

                                </div>
                                <div className="user-modal-col">
                                    <form className="form-container flex justify-center column  align-center" action="">
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
        userProfile: state.userReducer.userProfile,
        loggedUser: state.userReducer.loggedUser
    }
}

const mapDispatchToProps = {
    loadBoards,
    getUserById,
    updateProfile
}

export const UserProfile = connect(mapStateToProps, mapDispatchToProps)(_UserProfile);