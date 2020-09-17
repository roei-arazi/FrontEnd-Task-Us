
import Modal from 'react-modal';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Boardbar } from '../cmps/Boardbar';
import { Navbar } from '../cmps/Navbar';
import { cloudinaryService } from '../services/cloudinaryService';
import { closeModal, openModal } from '../store/actions/systemActions'
import { VscClose } from 'react-icons/vsc';
class _UserProfile extends Component {

    render() {
        const modalStyles = {
            content: {
                top: '50%',
                left: '50%',
                right: 'auto',
                bottom: 'auto',
                height: '75%',
                width: '55%',
                marginRight: '-50%',
                transform: 'translate(-50%, -50%)'
            }
        }
        return (
            <section className="user-profile">
                <Navbar />
                <Boardbar />
                <div className="user-container">
                    <header className="header-container padding-x-15 flex justify-center  align-center">
                        <img className="user-profile-big" src="https://via.placeholder.com/250" alt="" />
                    </header>

                    <div className="user-details-container padding-x-30 padding-y-30 align-center  flex column">
                        <h2 onClick={this.props.openModal}
                            className="clickable-header">Edit Profile</h2>
                        <div className="user-details-inner-container">

                            <h3>Email: user@email</h3>
                            <h3>Full Name: Yitzhak yaka</h3>
                            <h3>Username: yithak133</h3>
                        </div>
                    </div>

                    <Modal
                        isOpen={this.props.modal.isOpen}
                        onRequestClose={this.props.closeModal}
                        style={modalStyles}
                        contentLabel="User Modal"
                    >
                        <div className="user-modal-col">
                            <VscClose onClick={this.props.closeModal} />
                            <img className="user-profile-big" src="https://via.placeholder.com/250" alt="" />
                        </div>

                        <div className="user-modal-col">
                            <form className="form-container flex justify-center column  align-center" action="">
                                <table>
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
                                </table>
                                <button>Save Changes</button>
                            </form>
                        </div>

                    </Modal>
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
    openModal,
    closeModal
}

export const UserProfile = connect(mapStateToProps, mapDispatchToProps)(_UserProfile);