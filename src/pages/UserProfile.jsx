import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Fade } from '@material-ui/core';
// Inside imports
import { Boardbar } from '../cmps/Boardbar';
import { Navbar } from '../cmps/Navbar';
import { userService } from '../services/userService.js';
import { updateUser } from '../store/actions/userActions';
import { cloudinaryService } from '../services/cloudinaryService';
import { MobileNav } from '../mobile-pages/MobileNav';
import { FaArrowLeft } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import socketService from '../services/socketService';
import { removeBoard, loadBoards } from '../store/actions/boardActions.js';
import { showSnackbar, hideSnackbar } from '../store/actions/systemActions.js';

class _UserProfile extends Component {
    state = {
        isModalOpen: false,
        user: {
            _id: '',
            email: '',
            username: '',
            fullName: '',
            imgUrl: '',
            selectedBoardId: '',
            selectedBoardName: '',
            isModalShown: false
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

    onToggleModal = () => {
        this.setState({ isModalShown: !this.state.isModalShown })
    }

    displayPopup(msg) {
        this.props.showSnackbar(msg)
        setTimeout(this.props.hideSnackbar, 3000)
    }

    onBoardRemove = async () => {
        const { boards, match, history, removeBoard, loggedUser } = this.props;
        const { selectedBoardId } = this.state;
        const board = boards.find(board => board._id === selectedBoardId);
        const notif = `${loggedUser.fullName} deleted ${board.name}`;
        userService.notifyUsers(notif, board.members, loggedUser)
        const { id } = match.params;
        if (boards.length === 1) {
            return;
        }
        await removeBoard(selectedBoardId);
        socketService.emit('add-delete-board')
        this.displayPopup('Removed board.');
        if (id === selectedBoardId) {
            const idx = boards.findIndex(board => board._id !== selectedBoardId)
            history.push(`/board/${boards[idx]._id}`)
        }
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
        const guestId = '5f71dbb63ba1780c44c9a6c9';
        const { loggedUser } = this.props
        const userCreatedBoards = this.props.boards.filter(board => board.boardCreator._id === this.state.user._id)
        const { isShown, isModalShown, selectedBoardName } = this.state;

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
                    <div className="user-details-container relative padding-x-30 padding-y-45 align-center justify-center flex  column">
                        <FaArrowLeft className="go-back-arrow absolute" onClick={() => this.props.history.goBack()} />
                        {(loggedUser._id === _id && loggedUser._id !== guestId) ? <h2 onClick={this.toggleModal}
                            className="clickable-header">Edit Profile</h2> : ''}
                        <div className="user-details-inner-container flex justify-center">
                            <div className="col-left">
                                <h1>Details</h1>
                                <h3>Email: {email}</h3>
                                <h3>Full Name: {fullName}</h3>
                            </div>
                            <hr />
                            <div className="col-mid">
                                <h1>Boards</h1>
                                {
                                    !userCreatedBoards.length
                                        ? <h3>No boards created.</h3>
                                        : <Fragment>
                                            <h3> Boards created by {loggedUser._id === this.props.match.params.id ? 'you' : 'this user:'} </h3>
                                            <div className="user-boards-container">
                                                {
                                                    userCreatedBoards.map((board, idx) => {
                                                        return <li className="flex" key={idx}>
                                                            {
                                                                loggedUser._id === this.props.match.params.id &&
                                                                <MdDelete onClick={ev => {
                                                                    this.setState({ selectedBoardId: board._id, selectedBoardName: board.name });
                                                                    this.onToggleModal()
                                                                }
                                                                } />
                                                            }
                                                            <p onClick={() => this.onMoveToBoard(board._id)}>{board.name}</p>
                                                        </li>
                                                    })
                                                }

                                            </div>
                                        </Fragment>
                                }

                            </div>
                            <hr />

                            <div className="col-right">
                                <h1>Tasks</h1>
                                <h3>Number of tasks assigned to {loggedUser._id === this.props.match.params.id ? 'you' : 'this user:'} : {numOfUserTasks}</h3>
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
                                        <input value={this.state.user.fullName} autoComplete="current-fullname" onChange={this.handleChange} name="fullName" placeholder="Full Name" type="text" />
                                        <button onClick={this.updateProfile}>Save Changes</button>
                                        <button type="button" className="secondary-btn" onClick={this.toggleModal}>Cancel</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </Fade>
                </div>
                {isModalShown && <div className="modal-screen-wrapper" onClick={this.onToggleModal}>
                    <div className="confirm-board-delete flex column space-between">
                        <h1>Are you sure you want to delete {selectedBoardName}?</h1>
                        <p>You can't take this back</p>
                        <section className="flex">
                            <button className="cancel-button" onClick={this.onToggleModal}>Cancel</button>
                            <button className="delete-button" onClick={this.onBoardRemove}>Delete</button>
                        </section>
                    </div>
                </div>}
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
    updateUser,
    removeBoard,
    showSnackbar
}
export const UserProfile = connect(mapStateToProps, mapDispatchToProps)(_UserProfile);