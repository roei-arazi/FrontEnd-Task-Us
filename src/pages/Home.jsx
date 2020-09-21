import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

import { loadBoards } from '../store/actions/boardActions'

class _Home extends Component {
    state = {

    }

    componentDidMount() {
        this.props.loadBoards()
    }

    render() {
        if (!this.props.boards || this.props.boards.length === 0) return <h1>Loading...</h1>
        return (
            <section className="home">
                <h1>Home</h1>
                <NavLink to={`/board/${this.props.boards[0]._id}`}>
                    <button>Start Here!</button>
                </NavLink>
                <NavLink to="/login">
                    <button>Login</button>
                </NavLink>
                <NavLink to="/signup">
                    <button>Sign-up</button>
                </NavLink>


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
    loadBoards
}

export const Home = connect(mapStateToProps, mapDispatchToProps)(_Home);