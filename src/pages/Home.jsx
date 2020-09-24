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
                <div className="home-header flex space-between align-center padding-x-15">
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
                <main className="home-main flex space-between align-center  ">
                    <div className="col-left flex align-center justify-center">

                        <video onClick={() => this.refs.video.play()} ref="video" autoPlay muted src="taskus-home-video.mp4"></video>
                    </div>
                    <div className="col-right flex align-center justify-center padding-x-30  column">
                        <h1>Lorem ipsum dolor sit amet!</h1>
                        <h2>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam, maxime</h2>
                        <h2>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam, maxime</h2>
                        <NavLink to={`/board/${this.props.boards[0]._id}`}>
                            <button className="guest-button">Try it Here!</button>
                        </NavLink>
                    </div>
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