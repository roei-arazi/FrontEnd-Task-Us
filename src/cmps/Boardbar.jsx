import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FaCog } from 'react-icons/fa'

<<<<<<< HEAD
class _Boardbar extends Component {
    state = {

    }

    componentDidMount() {
    }

    render() {
        return (
            <section className="board-bar">

=======

class _Boardbar extends Component {
    state = {

    }

    componentDidMount() {
        console.log(Boardbar, this.props);
    }

    render() {
        return (
            <section className="boardbar fixed column">
                <h1>Boards</h1>
                <input type="text" placeholder="Search Board" />
                <ul>
                    <li><FaCog />Board 1</li>
                    <li><FaCog />Board 2</li>
                </ul>
>>>>>>> c3c00249c89b22be8306d9fd6ee954f453e61440
            </section>
        )
    }
}

const mapStateToProps = state => {
    return {

    }
}

const mapDispatchToProps = {

}

export const Boardbar = connect(mapStateToProps, mapDispatchToProps)(_Boardbar);