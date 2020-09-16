import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Boardbar } from '../cmps/Boardbar';
import { Navbar } from '../cmps/Navbar';

class _UserProfile extends Component {
state = {

}

componentDidMount() {
console.log(UserProfile, this.props);
}

render() {
return (
<section className="user-profile">
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

export const UserProfile = connect(mapStateToProps, mapDispatchToProps)(_UserProfile);