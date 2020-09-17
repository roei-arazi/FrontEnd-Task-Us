import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FaCog, FaPlus } from 'react-icons/fa'
import { withRouter } from 'react-router-dom';
import { Menu, MenuItem, Snackbar, Button } from '@material-ui/core';
import { removeBoard, addBoard } from '../store/actions/boardActions.js';

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

    handleSnackbarOpen = () => {
        this.setState({ isSnackbarOpen: true })
    }

    handleSnackbarClose = () => {
        this.setState({ isSnackbarOpen: false });
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
        await this.handleSnackbarOpen();
        if (id === boardId) {
            const idx = boards.findIndex(board => board._id !== boardId)
            history.push(`/board/${boards[idx]._id}`)
        }
    }

    render() {
        const { boards } = this.props
        const { anchorEl, selectedBoardId, isSnackbarOpen } = this.state;
        return (
            <section className="boardbar padding-x-15 padding-y-15 fixed column">
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={isSnackbarOpen}
                    autoHideDuration={3000}
                    onClose={this.handleSnackbarClose}
                    message="Board deleted."
                    action={<Button color="primary" onClick={this.handleSnackbarClose}>Close</Button>}
                />
                <h1>Boards</h1>
                <input type="text" placeholder="Search Board" />
                <FaPlus onClick={this.props.addBoard} />
                <ul>
                    {boards.map((board, idx) => {
                        return <li
                            className="flex"

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
                    <MenuItem onClick={() => this.onBoardRemove(selectedBoardId)}>Delete board id: {selectedBoardId}</MenuItem>
                    <MenuItem onClick={this.handleMenuClose}>Edit</MenuItem>
                </Menu>
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
    addBoard
}

export const Boardbar = connect(mapStateToProps, mapDispatchToProps)(withRouter(_Boardbar));