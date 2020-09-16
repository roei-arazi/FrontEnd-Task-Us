import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

class _Home extends Component {
state = {

}

componentDidMount() {

}

render() {
return (
<section className="home">
<h1>Home</h1>
<NavLink to="/board/123">
<button>Start Here!</button>
</NavLink>
<NavLink to="/login">
<button>Login</button>   
</NavLink>
<NavLink to="/signup">
<button>Sign-up</button>
</NavLink>


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

export const Home = connect(mapStateToProps, mapDispatchToProps)(_Home);