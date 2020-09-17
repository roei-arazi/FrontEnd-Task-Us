import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FaCog } from 'react-icons/fa'
import { withRouter } from 'react-router-dom';
import { Menu, MenuItem } from '@material-ui/core';


class _Boardbar extends Component {
    state = {
        anchorEl: null
    }

    componentDidMount() {

    }

    onMoveToBoard(id) {
        this.props.history.push(`/board/${id}`)
    }

    handleOpen = (ev) => {
        console.log('got target', ev.currentTarget);
        this.setState({anchorEl: ev.currentTarget})
    }

    handleClose = ()=>{
        this.setState({anchorEl: null})
    }

    render() {
        const { boards } = this.props;
        const {anchorEl} = this.state;
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
                                <MenuItem onClick={this.handleClose}>Delete</MenuItem>
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

}

export const Boardbar = connect(mapStateToProps, mapDispatchToProps)(withRouter(_Boardbar));