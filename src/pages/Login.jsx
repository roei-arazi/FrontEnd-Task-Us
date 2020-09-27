import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { FaArrowLeft, FaFacebookF, FaUserCircle } from 'react-icons/fa';
import FacebookLogin from 'react-facebook-login'
// Inside imports
import { login, guestLogin, signup } from '../store/actions/userActions.js'
import { loadBoards } from '../store/actions/boardActions'

class _Login extends Component {
    state = {
        isLoading: false,
        isErrLogin: false
    }
    componentDidMount() {
    }
    onLogin = async (values, { resetForm }) => {
        try {
            resetForm();
            await this.props.login(values);
            this.setState({ isLoading: true })
            await this.props.loadBoards()
            this.setState({ isLoading: false })
            if (this.props.loggedUser) this.props.history.push(`/board/${this.props.boards[0]._id}`)
        }
        catch (err) {
            this.setState({ isErrLogin: true })
        }

    }
    onGuestLogin = async () => {
        await this.props.guestLogin();
        this.props.history.push(`/board/${this.props.boards[0]._id}`)
    }
    responseFacebook = async (response) => {
        const user = {
            username: response.name,
            email: response.email,
            imgUrl: response.picture.data.url,
            facebookId: response.userID
        }
        await this.props.login(user)
        if (this.props.loggedUser) this.props.history.push(`/board/${this.props.boards[0]._id}`)
    }
    render() {
        const initialValues = { username: '', password: '' }
        if (this.state.isLoading) return (
            <div className="loader-container flex justify-center align-center">
                <img src="loading.gif" alt="" />
            </div>
        )
        return <div className="sign-login">
            <Formik
                initialValues={initialValues}
                validate={formValues => {
                    const errors = {};
                    if (!formValues.username) errors.username = 'Required';
                    if (!formValues.password) errors.password = 'Required';
                    return errors;
                }}
                onSubmit={this.onLogin}>
                <Form className="sign-login-form flex column align-center space-around">
                    <FaUserCircle />
                    <section>
                        <legend>Username *</legend>
                        <Field className="sign-login-input" type="text" autoComplete="curren-username" name="username" />
                    </section>
                    <ErrorMessage name="email" component="span" />
                    <section>
                        <legend>Password *</legend>
                        <Field className="sign-login-input" type="password" autoComplete="current-password" name="password" />
                    </section>
                    <ErrorMessage name="password" component="span" />
                    <button type="submit flex">Login</button>
                    {this.state.isErrLogin && <div className="login-err-modal">
                        X
                    <h2>Wrong password / username</h2>
                    </div>}
                    <div type="button" className="facebook-btn-container">
                        <FaFacebookF />
                        <FacebookLogin
                            appId="632288707652598"
                            fields="name,email,picture"
                            cssClass="facebook-btn"
                            callback={this.responseFacebook} />
                    </div>
                    <a href="/#/signup">Don't have an account? sign up here.</a>
                    <button className="guest-button" onClick={this.onGuestLogin}>Or try as a guest!</button>
                </Form>
            </Formik>
            <div data-title="Back to home" className="go-back">
                <NavLink to="/"><FaArrowLeft /></NavLink>
            </div>
        </div>
    }
}
const mapStateToProps = state => {
    return {
        loggedUser: state.userReducer.loggedUser,
        boards: state.boardReducer.boards
    }
}
const mapDispatchToProps = {
    login,
    guestLogin,
    loadBoards,
    signup
}
export const Login = connect(mapStateToProps, mapDispatchToProps)(withRouter(_Login));