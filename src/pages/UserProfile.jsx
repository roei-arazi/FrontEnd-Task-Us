
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Boardbar } from '../cmps/Boardbar';
import { Navbar } from '../cmps/Navbar';
import { Fade } from '@material-ui/core';
import { loadBoards } from '../store/actions/boardActions'
class _UserProfile extends Component {
    state = {
        isModalOpen: false
    }
    componentDidMount() {
        this.props.loadBoards()
    }
    toggleModal = () => {
        this.setState({ isModalOpen: !this.state.isModalOpen })
    }
    render() {
        console.log('STATE:', this.state.isModalOpen)
        return (
            <section className="user-profile">
                <Navbar />
                <Boardbar />
                <div className="user-container">
                    <header className="header-container padding-x-15 padding-y-15 flex justify-center  align-center">
                        <img className="user-profile-big" src="https://via.placeholder.com/250" alt="" />
                    </header>

                    <div className="user-details-container padding-x-30 padding-y-30 align-center  flex column">
                        <h2 onClick={this.toggleModal}
                            className="clickable-header">Edit Profile</h2>
                        <div className="user-details-inner-container">

                            <h3>Email: <span className="span-user-details">user@email</span></h3>
                            <h3>Full Name: <span className="span-user-details">Yitzhak yaka</span></h3>
                            <h3>Username: <span className="span-user-details">yithak133</span> </h3>
                        </div>
                    </div>

                    <Fade in={this.state.isModalOpen}>
                        <div className="modal-screen flex justify-center align-center">
                            <div className="modal-container padding-x-15 padding-y-15">
                                <div className="user-modal-col">
                                    <img className="user-profile-big" src="https://via.placeholder.com/250" alt="" />
                                </div>

                                <div className="user-modal-col">
                                    <form className="form-container flex justify-center column  align-center" action="">
                                        <input placeholder="Email" type="email" />
                                        <input placeholder="Username" type="text" />
                                        <input placeholder="Password" type="password" />
                                        <input placeholder="Full Name" type="text" />
                                        <button>Save Changes</button>
                                        <button onClick={this.toggleModal}>Cancel</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </Fade>


                </div>
            </section>
        )
    }
}

const mapStateToProps = state => {
    return {
        modal: state.systemReducer.modal
    }
}

const mapDispatchToProps = {
    loadBoards
}

export const UserProfile = connect(mapStateToProps, mapDispatchToProps)(_UserProfile);