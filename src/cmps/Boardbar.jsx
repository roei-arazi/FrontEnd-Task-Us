import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Menu, MenuItem } from '@material-ui/core';
import { HiOutlineCog } from 'react-icons/hi';
import { BsFilePlus, BsArrowsCollapse, BsArrowsExpand } from 'react-icons/bs';
import { Tooltip, Zoom } from '@material-ui/core';

import { removeBoard, addBoard, toggleBoardbar, updateBoard, recieveUpdate } from '../store/actions/boardActions.js';
import { showSnackbar, hideSnackbar } from '../store/actions/systemActions.js';
import socketService from '../services/socketService';

class _Boardbar extends Component {
    state = {
        anchorEl: null,
        selectedBoardId: '',
        isSnackbarOpen: false,
        isShown: ''
    } 
    componentDidMount() {
        socketService.on('updatedBoard', updatedBoard => {
            console.log('got board:', updatedBoard);
             this.props.recieveUpdate(updatedBoard)
            });
        this.setState({ isShown: this.props.isBoardbarShown })
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

    onBoardRemove = async (boardId) => {
        const { boards, match, history, removeBoard } = this.props
        const { id } = match.params;
        this.handleMenuClose()
        if (boards.length === 1) {
            console.log('you need at least one board!');
            return;
        }
        await removeBoard(boardId);
        await this.props.showSnackbar('Removed board.');
        setTimeout(() => this.props.hideSnackbar(), 3000)
        if (id === boardId) {
            const idx = boards.findIndex(board => board._id !== boardId)
            history.push(`/board/${boards[idx]._id}`)
        }
    }

    onToggleShown = () => {
        this.props.toggleBoardbar()
        this.setState({ isShown: !this.state.isShown })
    }

    render() {
        const { boards } = this.props
        const { anchorEl, selectedBoardId, isShown } = this.state;
        return (
            <section className={`boardbar fixed column ${isShown && 'board-bar-shown'}`}>
                {
                    isShown ? (
                        <Tooltip enterDelay={800} TransitionComponent={Zoom} title="Toggle Board" arrow>
                            <div className="board-bar-toggle-container">
                                <BsArrowsCollapse style={{ color: this.props.location.pathname.includes('/myweek') && '#151515' }}
                                    onClick={this.onToggleShown} className="board-bar-toggle" />
                            </div>
                        </Tooltip>
                    )

                        : (
                            <Tooltip enterDelay={800} TransitionComponent={Zoom} title="Toggle Board" arrow>
                                <div className="board-bar-toggle-container">
                                    <BsArrowsExpand style={{ color: this.props.location.pathname.includes('/myweek') && '#151515' }}
                                        onClick={this.onToggleShown} className="board-bar-toggle" />
                                </div>
                            </Tooltip>
                        )
                }

                {isShown && <div className="boardbar-header">
                    <h1>Boards</h1>
                    <BsFilePlus onClick={this.props.addBoard} />
                </div>}
                {isShown && <input type="text" placeholder="Search Board" />}
                <ul>
                    {isShown && boards.map((board, idx) => {
                        return <li
                            className="flex align-center"

                            key={idx}>
                            <HiOutlineCog onClick={(ev) => this.handleMenuOpen(ev, board._id)} />

                            <h4 onClick={() => this.onMoveToBoard(board._id)}>{board.name}</h4>
                        </li>
                    })}
                </ul>
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
                {/* <Popup /> */}
            </section>
        )
    }
}

const mapStateToProps = state => {
    return {
        boards: state.boardReducer.boards,
        isBoardbarShown: state.boardReducer.isBoardbarShown
    }
}

const mapDispatchToProps = {
    updateBoard,
    removeBoard,
    addBoard,
    showSnackbar,
    hideSnackbar,
    toggleBoardbar,
    recieveUpdate
}

export const Boardbar = connect(mapStateToProps, mapDispatchToProps)(withRouter(_Boardbar));