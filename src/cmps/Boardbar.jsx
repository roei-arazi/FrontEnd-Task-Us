import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FaCog } from 'react-icons/fa'


class _Boardbar extends Component {
    state = {

    }

    componentDidMount() {
    }

    render() {
        return (
            <section className="boardbar padding-x-15 padding-y-15 fixed column">
                <h1>Boards</h1>
                <input type="text" placeholder="Search Board" />
                <ul>
                    <li><FaCog />Board 1</li>
                    <li><FaCog />Board 2</li>
                </ul>
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