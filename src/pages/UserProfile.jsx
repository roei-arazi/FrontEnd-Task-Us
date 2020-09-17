import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Boardbar } from '../cmps/Boardbar';
import { Navbar } from '../cmps/Navbar';

class _UserProfile extends Component {
    state = {

    }

    componentDidMount() {
    }

    render() {
        return (
            <section className="user-profile">
                <Navbar />
                <Boardbar />
                <div className="user-container">
                    <header className="header-container padding-x-15 flex justify-center  align-center">
                        <img src="https://via.placeholder.com/250" alt="" />
                    </header>

                    {/* <form className="form-container flex justify-center column  align-center" action="">
                        <label htmlFor="email">Email:</label>
                        <input type="email" name="email" id="email" />
                        <label htmlFor="fullName">Full name:</label>
                        <input type="text" name="fullName" id="fullName" />
                        <label htmlFor="username">Username:</label>
                        <input type="text" name="username" id="username" />
                    </form> */}

                    <div className="user-details-container padding-x-30 padding-y-30 align-center  flex column">
                        <h2 className="clickable-header">Edit Profile</h2>
                        <div className="user-details-inner-container">

                            <h3>Email: user@email</h3>
                            <h3>Full Name: Yitzhak yaka</h3>
                            <h3>Username: yithak133</h3>
                        </div>
                    </div>
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

export const UserProfile = connect(mapStateToProps, mapDispatchToProps)(_UserProfile);