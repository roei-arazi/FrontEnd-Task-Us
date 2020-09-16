import React, { Component } from 'react';
import { connect } from 'react-redux';

class _Boardbar extends Component {
state = {

}

componentDidMount() {
console.log(Boardbar, this.props);
}

render() {
return (
<section className="board-bar">

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

export const Boardbar = connect(mapStateToProps, mapDispatchToProps)(_Boardbar);