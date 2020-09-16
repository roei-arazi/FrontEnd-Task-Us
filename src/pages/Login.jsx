import React, { Component } from 'react';
import { connect } from 'react-redux';

class _Login extends Component {
state = {

}

componentDidMount() {
console.log(Login, this.props);
}

render() {
return (
<section className="login">

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

export const Login = connect(mapStateToProps, mapDispatchToProps)(_Login);