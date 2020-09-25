import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

import { loadBoards } from '../store/actions/boardActions'

class _Home extends Component {


    componentDidMount() {
        this.video = React.createRef();

        this.props.loadBoards()
    }

    render() {
        if (!this.props.boards || this.props.boards.length === 0) return <h1>Loading...</h1>
        return (
            <section className="home flex column">
                <main className="home-main flex align-center  ">
                    <div className="home-login-sign-cta absolute">
                        <NavLink to="/login">
                            <button>Login</button>
                        </NavLink>
                        <NavLink to="/signup">
                            <button>Sign-up</button>
                        </NavLink>
                    </div>
                    <div className="col-left flex align-center justify-center">

                        <video onClick={() => this.video.current.play()} ref={this.video} autoPlay muted src="taskus-home-video.mp4"></video>
                    </div>
                    <div className="col-right flex align-center justify-center padding-x-30  column">
                        <h1>Working in a large scale company?</h1>
                        <h2>Do you need to keep track of hundreds of tasks?</h2>
                        <h2>Need an efficient way to manage your co-workers / employees?</h2>
                        <h2>Then this is the app for you.</h2>
                        <NavLink to={`/board/${this.props.boards[0]._id}`}>
                            <button className="guest-button absolute">Try As a Guest!</button>
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