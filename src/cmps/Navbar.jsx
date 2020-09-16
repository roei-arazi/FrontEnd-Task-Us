import React, { Component } from 'react';
import { connect } from 'react-redux';

class _Navbar extends Component {
state = {

}

componentDidMount() {
console.log(Navbar, this.props);
}

render() {
return (
<div>

</div>
)
}
}

const mapStateToProps = state => {
return {

}
}

const mapDispatchToProps = {

}

export const Navbar = connect(mapStateToProps, mapDispatchToProps)(_Navbar);