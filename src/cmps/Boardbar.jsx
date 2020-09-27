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
        searchVal: ''
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
    onMoveToDashboard = (ev) => {
        this.props.history.push(`/dashboard`)

    }
    onAddBoard = async () => {
        const { loggedUser } = this.props;
        await this.props.addBoard(this.props.loggedUser)
        const notif = `${loggedUser.fullName} added a new board`
        userService.notifyUsers(notif, 'add', loggedUser)
        socketService.emit('add-delete-board')
    }
    onBoardRemove = async (boardId) => {
        const { boards, match, history, removeBoard, loggedUser } = this.props
        const board = boards.find(board => board._id === boardId);
        const notif = `${loggedUser.fullName} deleted ${board.name}`;
        userService.notifyUsers(notif, board.members, loggedUser)
        const { id } = match.params;
        if (boards.length === 1) {
            return;
        }
        await removeBoard(boardId);
        socketService.emit('add-delete-board')
        this.displayPopup('Removed board.');
        if (id === boardId) {
            const idx = boards.findIndex(board => board._id !== boardId)
            history.push(`/board/${boards[idx]._id}`)
        }
    }
    onToggleShown = () => {
        this.props.toggleBoardbar()
        this.setState({ isShown: !this.state.isShown })
    }


    handleSearch = () => {
        const filteredBoards =
            this.props.boards.filter(board => board.name.toLowerCase().includes(this.state.searchVal.toLowerCase()))
        return filteredBoards
    }
    render() {
        const { isShown } = this.state;
        const { loggedUser } = this.props;
        const filteredBoards = this.handleSearch()
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
                {isShown && <input onChange={this.handleSearchChange} type="text" placeholder="Search Board" />}
                <ul>
                    {isShown && filteredBoards.map((board, idx) => {
                        return <li
                            style={{ paddingLeft: (loggedUser._id === board.boardCreator._id || loggedUser.isAdmin) ? '' : '25px' }}
                            className="flex align-center cursor-pointer"
                            key={idx}
                            onClick={() => this.onMoveToBoard(board._id)} >
                            {
                                (loggedUser._id === board.boardCreator._id || loggedUser.isAdmin) &&
                                <MdDelete onClick={ev => {
                                    ev.stopPropagation()
                                    this.onBoardRemove(board._id)
                                }
                                } />
                            }
                            <h5 style={{ color: (loggedUser._id === board.boardCreator._id || loggedUser.isAdmin) ? "#0085ff" : "#333333" }}>
                                {board.name}
                            </h5>
                        </li>
                    })}
                </ul>

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