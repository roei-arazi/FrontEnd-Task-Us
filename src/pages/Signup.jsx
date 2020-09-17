import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

class _Signup extends Component {
state = {

}

componentDidMount() {
}

render() {
return (
<section className="signup">
<div style={{marginLeft:'350px'}}>
<h1>Under Construction...</h1>
<NavLink to="/board/123">
<button>Go To Board!</button>
</NavLink>
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

export const Signup = connect(mapStateToProps, mapDispatchToProps)(_Signup);