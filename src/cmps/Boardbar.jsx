import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Menu, MenuItem } from '@material-ui/core';
import { HiOutlineCog } from 'react-icons/hi';
import { BsFilePlus, BsFillPlusCircleFill, BsArrowsCollapse, BsArrowsExpand } from 'react-icons/bs';
import { Tooltip, Zoom } from '@material-ui/core';

import { removeBoard, addBoard, toggleBoardbar, updateBoard, recieveUpdate } from '../store/actions/boardActions.js';
import { showSnackbar, hideSnackbar } from '../store/actions/systemActions.js';
import socketService from '../services/socketService';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';

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

    onBoardRemove = (boardId) => {
        const { boards, match, history, removeBoard } = this.props
        const { id } = match.params;
        this.handleMenuClose()
        if (boards.length === 1) {
            console.log('you need at least one board!');
            return;
        }
        removeBoard(boardId);
        this.props.showSnackbar('Removed board.');
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
                        <Tooltip enterDelay={800} TransitionComponent={Zoom} title="Toggle Board" arrow>
                            <div onClick={this.onToggleShown} className="board-bar-toggle-container">
                                <AiOutlineRight style={{ color: this.props.location.pathname.includes('/myweek') && '#151515', transform: isShown && 'rotate(180deg)' }}
                                    className="board-bar-toggle" />
                            </div>
                            {/* <div className="board-bar-toggle">
                                <AiOutlineLeft />
                            </div> */}
                        </Tooltip>

                {isShown && <div className="boardbar-header">
                    <h1>Boards</h1>
                    <BsFillPlusCircleFill onClick={this.props.addBoard} />

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