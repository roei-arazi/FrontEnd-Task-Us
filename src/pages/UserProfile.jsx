
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Boardbar } from '../cmps/Boardbar';
import { Navbar } from '../cmps/Navbar';
import { cloudinaryService } from '../services/cloudinaryService';
import { VscClose } from 'react-icons/vsc';
import { Fade, FormControlLabel, Switch } from '@material-ui/core';
class _UserProfile extends Component {
    state = {
        isModalOpen: false
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
                    <header className="header-container padding-x-15 flex justify-center  align-center">
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
                        <div onClick={this.toggleModal} className="modal-screen">
                            <div className="fade-wrapper">
                                <div className="user-modal-col">
                                    <VscClose onClick={this.toggleModal} />
                                    <img className="user-profile-big" src="https://via.placeholder.com/250" alt="" />
                                </div>

                                <div className="user-modal-col">
                                    <form className="form-container flex justify-center column  align-center" action="">
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <label htmlFor="email">Email:</label>
                                                    </td>
                                                    <td>
                                                        <input type="email" name="email" id="email" />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <label htmlFor="fullName">Full name:</label>
                                                    </td>
                                                    <td>
                                                        <input type="text" name="fullName" id="fullName" />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <label htmlFor="username">Username:</label>
                                                    </td>
                                                    <td>
                                                        <input type="text" name="username" id="username" />
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <button>Save Changes</button>
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

}

export const UserProfile = connect(mapStateToProps, mapDispatchToProps)(_UserProfile);