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
            <section className="home flex column">
                <div className="home-header flex space-between align-center">
                <h1>Home</h1>
                <div className="home-header-right flex">
                <NavLink to="/login">
                    <button className="home-header-btn">Login</button>
                </NavLink>
                <NavLink to="/signup">
                    <button className="home-header-btn">Sign-up</button>
                </NavLink>
                </div>
                </div>
                <main className="home-main flex justify-center align-center column">
                <NavLink to={`/board/${this.props.boards[0]._id}`}>
                    <button className="guest-button">Start Here!</button>
                </NavLink>
                </main>


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