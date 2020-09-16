import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Boardbar } from '../cmps/Boardbar';
import { Navbar } from '../cmps/Navbar';

class _MyWeek extends Component {
state = {

}

componentDidMount() {
console.log(MyWeek, this.props);
}

render() {
return (
<section className="my-week">
<Navbar />
<Boardbar />
<div style={{marginLeft:'350px'}}>
<h1>Under Construction...</h1>
</div>
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

export const MyWeek = connect(mapStateToProps, mapDispatchToProps)(_MyWeek);