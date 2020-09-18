import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Menu, MenuItem } from '@material-ui/core';
import { FaCog } from 'react-icons/fa';
import { IoIosAddCircle } from 'react-icons/io';

import { removeBoard, addBoard } from '../store/actions/boardActions.js';
import { showSnackbar, hideSnackbar } from '../store/actions/systemActions.js';

class _Boardbar extends Component {
    state = {
        anchorEl: null,
        selectedBoardId: '',
        isSnackbarOpen: false
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

    render() {
        const { boards, isSnackbarShown } = this.props
        const { anchorEl, selectedBoardId } = this.state;
        console.log('isSnackbarShown', isSnackbarShown);
        return (
            <section className="boardbar padding-x-15 padding-y-15 fixed column">

                <div className="boardbar-header">
                    <h1>Boards</h1>
                    <IoIosAddCircle onClick={this.props.addBoard} />
                </div>
                <input type="text" placeholder="Search Board" />
                <ul>
                    {boards.map((board, idx) => {
                        return <li
                            className="flex align-center"

                            key={idx}>
                            <FaCog onClick={(ev) => this.handleMenuOpen(ev, board._id)} />

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