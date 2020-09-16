import React, { Component } from 'react';
import { connect } from 'react-redux';

class _Signup extends Component {
state = {

}

componentDidMount() {
console.log(Signup, this.props);
}

render() {
return (
<section className="signup">

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