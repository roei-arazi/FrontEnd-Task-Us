import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Fade } from '@material-ui/core';
// Inside imports
import { Boardbar } from '../cmps/Boardbar';
import { Navbar } from '../cmps/Navbar';
import { loadBoards } from '../store/actions/boardActions';
import { userService } from '../services/userService.js';
import { updateUser } from '../store/actions/userActions';
import { cloudinaryService } from '../services/cloudinaryService';
import { MobileNav } from '../mobile-pages/MobileNav';
import { FaArrowLeft } from 'react-icons/fa';

class _UserProfile extends Component {
    state = {
        isModalOpen: false,
        user: {
            _id: '',
            email: '',
            username: '',
            passowrd: '',
            fullName: '',
            imgUrl: ''
        }

    }
    async componentDidMount() {
        this.props.loadBoards();
        setTimeout(async () => {
            const user = await userService.getUserById(this.props.match.params.id)
            this.setState({ user: { ...user } })
        }, 500);
    }
    async componentDidUpdate(prevProps) {
        if (prevProps.match.params.id !== this.props.match.params.id) {
            this.setState({ user: {} }, () => {
                setTimeout(async () => {
                    const user = await userService.getUserById(this.props.match.params.id)
                    this.setState({ user: { ...user } })
                }, 500)
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

    onMoveToBoard(id) {
        this.props.history.push(`/board/${id}`)
    }

    render() {
        let { email, fullName, imgUrl, _id } = this.state.user;
        if (!_id) {
            return (
                <div className="loader-container flex justify-center align-center">
                    <img src='loading.gif' alt="" />
                </div>
            )
        }
        const [firstName, lastName] = fullName.split(' ');
        let initials = firstName.charAt(0).toUpperCase();
        if (lastName) initials += lastName.charAt(0).toUpperCase()
        const guestId = '5f6efc73805dbf6054d58794';
        const { loggedUser } = this.props
        const userCreatedBoards = this.props.boards.filter(board => board.boardCreator._id === this.state.user._id)

        let numOfUserTasks = 0
        this.props.boards.forEach(board => {
            board.groups.forEach(group => {
                group.tasks.forEach(task => {
                    task.members.forEach(member => {
                        if (member && member._id === this.state.user._id) {
                            numOfUserTasks++
                        }
                    })
                })
            })
        })
        console.log('props', this.props)
        return (
            <section className={`user-profile flex ${window.innerWidth < 450 && 'column'}`}>
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
                            <div className="user-profile-big initials flex align-center justify-center">{initials}</div>}
                    </header>
                    <div className="user-details-container padding-x-30 padding-y-45 align-center  flex  column">
                        <FaArrowLeft className="go-back-arrow" onClick={() => this.props.history.goBack()} />
                        {(loggedUser._id === _id && loggedUser._id !== guestId) ? <h2 onClick={this.toggleModal}
                            className="clickable-header">Edit Profile</h2> : ''}
                        <div className="user-details-inner-container flex justify-center">
                            <div className="col-left">
                                <h1>Details</h1>
                                <h3>Email: {email}</h3>
                                <h3>Full Name: {fullName}</h3>
                            </div>
                            <div className="col-mid">
                                <h1>Boards</h1>
                                {
                                    !userCreatedBoards.length
                                        ? <h3>No boards created.</h3>
                                        : <h3> Boards created by {loggedUser._id === this.props.match.params.id ? 'you' : 'this user:'}  <br />  {
                                            userCreatedBoards.map((board, idx) => {
                                                return <li onClick={() => this.onMoveToBoard(board._id)} key={idx}>{board.name}</li>
                                            })
                                        }
                                        </h3>
                                }
                            </div>
                            <div className="col-right">
                                <h1>Tasks</h1>
                                <h3>Number of tasks assigned to this user: {numOfUserTasks}</h3>
                            </div>
                        </div>
                    </div>
                    <Fade in={this.state.isModalOpen}>
                        <div className="modal-screen flex justify-center align-center">
                            <div className="modal-container absolute">
                                <div className="user-modal-header padding-x-15 padding-y-15 flex justify-center align-center">
                                    <label> {this.state.user.imgUrl ?
                                        <img className="user-profile-big" src={this.state.user.imgUrl} alt="profile-img" />
                                        :
                                        <div className="user-profile-big initials flex align-center justify-center">{initials}</div>}
                                        <input type="file" onChange={this.uploadImg} hidden />
                                    </label>
                                </div>
                                <div className="user-modal-main">
                                    <form className="form-container flex justify-center column  align-center" onSubmit={this.updateProfile}>
                                        <input value={this.state.user.email} autoComplete="current-email" onChange={this.handleChange} name="email" placeholder="Email" type="email" />
                                        <input value={this.state.user.username} autoComplete="current-username" onChange={this.handleChange} name="username" placeholder="Username" type="text" />
                                        <input autoComplete="current-password" name="password" placeholder="Old password" type="password" />
                                        <input autoComplete="current-password" onChange={this.handleChange} name="password" placeholder="New Password" type="password" />
                                        <input value={this.state.user.fullName} autoComplete="current-fullname" onChange={this.handleChange} name="fullName" placeholder="Full Name" type="text" />
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