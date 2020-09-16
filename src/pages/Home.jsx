import React, { Component } from 'react';
import { connect } from 'react-redux';

class _Home extends Component {
state = {

}

componentDidMount() {
console.log(Home, this.props);
}

render() {
return (
<section className="home">

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