import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Menu, MenuItem } from '@material-ui/core';
import { HiOutlineCog } from 'react-icons/hi';
import { BsFilePlus, BsArrowsCollapse, BsArrowsExpand } from 'react-icons/bs';
import { Tooltip, Zoom } from '@material-ui/core';

import { removeBoard, addBoard } from '../store/actions/boardActions.js';
import { showSnackbar, hideSnackbar } from '../store/actions/systemActions.js';

class _Boardbar extends Component {
    state = {
        anchorEl: null,
        selectedBoardId: '',
        isSnackbarOpen: false,
        isShown: true
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
        this.setState({ isShown: !this.state.isShown })
    }

    render() {
        const { boards, isSnackbarShown } = this.props
        const { anchorEl, selectedBoardId, isShown } = this.state;
        console.log('isSnackbarShown', isSnackbarShown);
        return (
            <section className={`boardbar fixed column ${isShown && 'board-bar-shown'}`}>
                {
                    isShown ? (
                        <Tooltip enterDelay={200} TransitionComponent={Zoom} title="Toggle board bar" arrow>
                            <div className="board-bar-toggle-container">
                                <BsArrowsCollapse style={{ color: this.props.location.pathname.includes('/myweek') && '#151515' }}
                                    onClick={this.onToggleShown} className="board-bar-toggle" />
                            </div>
                        </Tooltip>
                    )

                        : (
                            <Tooltip enterDelay={200} TransitionComponent={Zoom} title="Toggle board bar" arrow>
                                <div className="board-bar-toggle-container">
                                    <BsArrowsExpand onClick={this.onToggleShown} className="board-bar-toggle" />
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
        boards: state.boardReducer.boards
    }
}

const mapDispatchToProps = {
    removeBoard,
    addBoard,
    showSnackbar,
    hideSnackbar
}

export const Boardbar = connect(mapStateToProps, mapDispatchToProps)(withRouter(_Boardbar));