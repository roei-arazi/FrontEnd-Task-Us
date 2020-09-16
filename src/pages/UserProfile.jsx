import React, { Component } from 'react';
import { connect } from 'react-redux';
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