import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Boardbar } from '../cmps/Boardbar';
import { Navbar } from '../cmps/Navbar';

class _Board extends Component {
state = {

}

componentDidMount() {
console.log(Board, this.props);
}

render() {
return (
<section className="board">
<Navbar />
<Boardbar />
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

export const Board = connect(mapStateToProps, mapDispatchToProps)(_Board);