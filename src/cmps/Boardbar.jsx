import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { BsFillPlusCircleFill, } from 'react-icons/bs';
import { MdDelete } from 'react-icons/md'
import { AiOutlineRight } from 'react-icons/ai';
// inside imports
import { updateUser } from '../store/actions/userActions.js';
import { showSnackbar, hideSnackbar } from '../store/actions/systemActions.js';
import socketService from '../services/socketService';
import { userService } from '../services/userService.js';
import {
    removeBoard, addBoard, toggleBoardbar,
    updateBoard, recieveUpdate, loadBoards
} from '../store/actions/boardActions.js';

class _Boardbar extends Component {
    state = {
        selectedBoardId: '',
        isSnackbarOpen: false,
        isShown: '',
        searchVal: '',
        isModalShown: false,
        selectedBoardName: ''
    }
    componentDidMount() {
      
        socketService.on('updatedBoard', updatedBoard => {
            this.props.recieveUpdate(updatedBoard)
        });
        socketService.on('reloadBoards', () => {
            this.props.loadBoards()
        })
        socketService.on('accept-notif', (notification) => {
            this.props.updateUser({ ...this.props.loggedUser, notifications: [notification, ...this.props.loggedUser.notifications] })
        })
        socketService.emit('user', this.props.loggedUser._id)
        this.setState({ isShown: this.props.isBoardbarShown })

    }
    componentWillUnmount() {
        socketService.off('updatedBoard')
        socketService.off('reloadBoards')
        socketService.off('accept-notif')
    }
    displayPopup(msg) {
        this.props.showSnackbar(msg)
        setTimeout(this.props.hideSnackbar, 3000)
    }
    onMoveToBoard(id) {
        this.props.history.push(`/board/${id}`)
    }
    onAddBoard = async () => {
        const { loggedUser } = this.props;
        await this.props.addBoard(this.props.loggedUser)
        const notif = `${loggedUser.fullName} added a new board`
        userService.notifyUsers(notif, 'add', loggedUser)
        socketService.emit('add-delete-board')
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
    onToggleShown = () => {
        this.props.toggleBoardbar()
        this.setState({ isShown: !this.state.isShown })
    }


    onToggleModal = () => {
        this.setState({ isModalShown: !this.state.isModalShown })
    }

    handleSearch = () => {
        const filteredBoards =
            this.props.boards.filter(board => board.name.toLowerCase().includes(this.state.searchVal.toLowerCase()))
        return filteredBoards
    }
    handleSearchChange = ({target}) => {
        this.setState({searchVal:target.value})
    }
    render() {
        const currBoardId = this.props.match.params.id;
        const { isShown, isModalShown, selectedBoardName } = this.state;
        const { loggedUser } = this.props;
        const filteredBoards = this.handleSearch()
         if(window.innerWidth <= 1050) return <div></div>
        return (
            <section className={`boardbar fixed column ${isShown && 'board-bar-shown'}`}>
                <div onClick={this.onToggleShown} className="board-bar-toggle-container">
                    <AiOutlineRight style={{ color: this.props.location.pathname.includes('/myweek') && '#151515', transform: isShown && 'rotate(180deg)' }}
                        className="board-bar-toggle" />
                </div>
                {isShown && <div className="boardbar-header">
                    <h1>Boards</h1>
                    <BsFillPlusCircleFill onClick={this.onAddBoard} />
                </div>}
                {isShown && <input onChange={this.handleSearchChange} type="text" placeholder="Search a Board" />}
                <ul>
                    {isShown && filteredBoards.map((board, idx) => {
                        return <li
                            style={{ paddingLeft: (loggedUser._id === board.boardCreator._id || loggedUser.isAdmin) ? '' : '25px' }}
                            className={`flex align-center cursor-pointer ${board._id === currBoardId && 'curr-board'}`}
                            key={idx}
                            onClick={() => this.onMoveToBoard(board._id)} >
                            {
                                (loggedUser._id === board.boardCreator._id || loggedUser.isAdmin) &&
                                <MdDelete onClick={ev => {
                                    ev.stopPropagation()
                                    this.setState({ selectedBoardId: board._id, selectedBoardName: board.name });
                                    this.onToggleModal()
                                }
                                } />
                            }
                            <h5 style={{ color: (loggedUser._id === board.boardCreator._id || loggedUser.isAdmin) ? "#0085ff" : "#333333" }}>
                                {board.name}
                            </h5>
                        </li>
                    })}
                </ul>
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
        boards: state.boardReducer.boards,
        isBoardbarShown: state.boardReducer.isBoardbarShown,
        loggedUser: state.userReducer.loggedUser
    }
}
const mapDispatchToProps = {
    updateBoard,
    removeBoard,
    addBoard,
    showSnackbar,
    hideSnackbar,
    toggleBoardbar,
    recieveUpdate,
    loadBoards,
    updateUser
}
export const Boardbar = connect(mapStateToProps, mapDispatchToProps)(withRouter(_Boardbar));