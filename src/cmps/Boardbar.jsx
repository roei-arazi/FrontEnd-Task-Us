import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FaCog } from 'react-icons/fa'
import { withRouter } from 'react-router-dom';
import { Menu, MenuItem } from '@material-ui/core';
import { removeBoard } from '../store/actions/boardActions.js';

class _Boardbar extends Component {
    state = {
        anchorEl: null
    }

    onMoveToBoard(id) {
        this.props.history.push(`/board/${id}`)
    }

    handleOpen = (ev) => {
        this.setState({ anchorEl: ev.currentTarget })
    }

    onBoardRemove = (boardId) => {
        const { id } = this.props.match.params;
        if (this.props.boards.length === 1) {
            console.log('you need at least one board!');
            return;
        }
        this.props.removeBoard(boardId);
        if (id === boardId) this.props.history.push(`/board/${this.props.boards[0]._id}`)
        this.setState({ anchorEl: null })
    }

    handleClose = ()=>{
        this.setState({anchorEl: null})
    }

    render() {
        const { boards } = this.props;
        const { anchorEl } = this.state;
        return (
            <section className="boardbar padding-x-15 padding-y-15 fixed column">
                <h1>Boards</h1>
                <input type="text" placeholder="Search Board" />
                <ul>
                    {/* <li><FaCog />Board 1</li>
                    <li><FaCog />Board 2</li> */}
                    {boards.map((board, idx) => {
                        return <li
                            className="flex"

                            key={idx}>
                            <FaCog onClick={this.handleOpen} />
                            <Menu
                                anchorEl={anchorEl}
                                keepMounted
                                open={Boolean(anchorEl)}
                                onClose={this.handleClose}
                            >
                                <MenuItem onClick={() => this.onBoardRemove(board._id)}>Delete</MenuItem>
                                <MenuItem onClick={this.handleClose}>Edit</MenuItem>
                            </Menu>
                            <h4 onClick={() => this.onMoveToBoard(board._id)}>{board.name}</h4>
                        </li>
                    })}
                </ul>
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