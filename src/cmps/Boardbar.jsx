import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FaCog } from 'react-icons/fa'
import { withRouter } from 'react-router-dom';
import { Menu, MenuItem } from '@material-ui/core';
import { removeBoard } from '../store/actions/boardActions.js';

class _Boardbar extends Component {
    state = {
        anchorEl: null,
        selectedBoardId: ''
    }

    onMoveToBoard(id) {
        this.props.history.push(`/board/${id}`)
    }

    handleOpen = (ev, boardId) => {
        this.setState({ anchorEl: ev.currentTarget, selectedBoardId: boardId })
    }

    onBoardRemove = async (boardId) => {
        const {boards, match, history, removeBoard} = this.props
        const { id } = match.params;
        this.handleClose()
        if (boards.length === 1) {
            console.log('you need at least one board!');
            return;
        }
        await removeBoard(boardId);
        if (id === boardId) {
            const idx = boards.findIndex(board => board._id !== boardId)
            history.push(`/board/${boards[idx]._id}`)
        }
    }

    handleClose = () => {
        this.setState({ anchorEl: null})
    }

    render() {
        const { boards } = this.props;
        const { anchorEl, selectedBoardId } = this.state;
        console.log('anchorEl', anchorEl, 'boardId', selectedBoardId);
        return (
            <section className="boardbar padding-x-15 padding-y-15 fixed column">
                <h1>Boards</h1>
                <input type="text" placeholder="Search Board" />
                <ul>
                    {boards.map((board, idx) => {
                        console.log('rendering board:', board._id);
                        return <li
                            className="flex"

                            key={idx}>
                            <FaCog  onClick={(ev) => this.handleOpen(ev, board._id)} />

                            <h4 onClick={() => this.onMoveToBoard(board._id)}>{board.name}</h4>
                        </li>
                    })}
                </ul>
                <Menu
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={this.handleClose}
                >
                    <MenuItem onClick={() => this.onBoardRemove(selectedBoardId)}>Delete board id: {selectedBoardId}</MenuItem>
                    <MenuItem onClick={this.handleClose}>Edit</MenuItem>
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
    removeBoard
}

export const Boardbar = connect(mapStateToProps, mapDispatchToProps)(withRouter(_Boardbar));