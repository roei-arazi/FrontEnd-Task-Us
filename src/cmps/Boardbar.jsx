import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Menu, MenuItem } from '@material-ui/core';
import { HiOutlineCog } from 'react-icons/hi';
import { BsFillPlusCircleFill, } from 'react-icons/bs';

import { removeBoard, addBoard, toggleBoardbar, updateBoard, recieveUpdate, loadBoards } from '../store/actions/boardActions.js';
import { updateUser } from '../store/actions/userActions.js';
import { showSnackbar, hideSnackbar} from '../store/actions/systemActions.js';
import socketService from '../services/socketService';
import {userService} from '../services/userService.js';
import { AiOutlineRight } from 'react-icons/ai';
import {Dashboard} from './Dashboard'

class _Boardbar extends Component {
    state = {
        anchorEl: null,
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
            console.log('reloading...');
            this.props.loadBoards()
        })
        socketService.on('accept-notif', (notification) => {
            this.props.updateUser({ ...this.props.loggedUser, notifications: [ notification, ...this.props.loggedUser.notifications] })
        })

        socketService.emit('user', this.props.loggedUser._id)
        this.setState({ isShown: this.props.isBoardbarShown })
    }

    componentWillUnmount() {
        socketService.off('updatedBoard')
        socketService.off('reloadBoards')
        socketService.off('accept-notif')
    }

    displayPopup(msg){
        this.props.showSnackbar(msg)
        setTimeout(this.props.hideSnackbar, 3000)
    }

    onMoveToBoard(id) {
        this.props.history.push(`/board/${id}`)
    }

    handleMenuOpen = (ev, boardId) => {
        this.setState({ anchorEl: ev.currentTarget, selectedBoardId: boardId })
    }

    handleMenuClose = () => {
        this.setState({ anchorEl: null })
    }

    onAddBoard = async () =>{
        const {loggedUser} = this.props;
        await this.props.addBoard(this.props.loggedUser)
        const notif = `${loggedUser.fullName} added a new board`
        userService.notifyUsers(notif,'add', loggedUser)
        socketService.emit('add-delete-board')
    }

    onBoardRemove = async (boardId) => {
        const { boards, match, history, removeBoard, loggedUser } = this.props
        const board = boards.find(board => board._id === boardId);
        const notif = `${loggedUser.fullName} deleted ${board.name}`;
        userService.notifyUsers(notif, board.members, loggedUser)
        const { id } = match.params;
        this.handleMenuClose()
        if (boards.length === 1) {
            console.log('you need at least one board!');
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
    handleSearchChange = (ev) => {
        this.setState({ searchVal: ev.target.value })
    }
    handleSearch = () => {
        const filteredBoards =
            this.props.boards.filter(board => board.name.toLowerCase().includes(this.state.searchVal.toLowerCase()))
        return filteredBoards
    }

    render() {
        const { anchorEl, selectedBoardId, isShown } = this.state;
        const filteredBoards = this.handleSearch()

        return (
            <section className={`boardbar fixed column ${isShown && 'board-bar-shown'}`}>
                <div data-title="Toggle Board" onClick={this.onToggleShown} className="board-bar-toggle-container">
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
                            className="flex align-center"
                            key={idx}>
                            <HiOutlineCog onClick={(ev) => this.handleMenuOpen(ev, board._id)} />

                            <h4 onClick={() => this.onMoveToBoard(board._id)}>{board.name}</h4>
                        </li>
                    })}
                </ul>
                <Dashboard />
                <Menu
                    role="menuContainer"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={this.handleMenuClose}
                >
                    <MenuItem onClick={() => this.onBoardRemove(selectedBoardId)}>Delete</MenuItem>
                    <MenuItem onClick={this.handleMenuClose}>Edit</MenuItem>
                </Menu>
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