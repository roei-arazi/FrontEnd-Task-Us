import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { FaArrowLeft, FaUserCircle } from 'react-icons/fa';
// Inside imports
import { signup, guestLogin } from '../store/actions/userActions.js'
import { loadBoards } from '../store/actions/boardActions'

class _Signup extends Component {
    state = {
        isLoading: false,
        isErrSignup: false,
        errMsg: ''
    }

    onSignup = async (values, { resetForm }) => {
        resetForm();
        const { username, password, email, fullName } = values;
        try {
            await this.props.signup({ username, password, email, fullName });
            this.setState({ isLoading: true })
            await this.props.loadBoards()
            this.setState({ isLoading: false })
            this.props.history.push(`/board/${this.props.boards[0]._id}`)
        } catch (err) {
            console.log('err', err);
            this.setState({ isErrSignup: true, errMsg: err})
            setTimeout(() => {
                this.setState({ isErrSignup: false })
            }, 2000);
        }
    }
    onGuestLogin = async () => {
        await this.props.guestLogin();
        this.props.history.push(`/board/${this.props.boards[0]._id}`)
    }
    render() {
        const initialValues = { username: '', password: '', confirm: '', email: '', fullName: '' }
        const {isErrSignup, errMsg} = this.state;
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
                    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    if (!formValues.username) errors.username = 'Required';
                    if (!formValues.fullName) errors.fullName = 'Required';
                    if (!formValues.password) errors.password = 'Required';
                    if (formValues.confirm !== formValues.password) errors.confirm = 'Doesn\'t match password';
                    if (!re.test(formValues.email.toLowerCase())) errors.email = 'Invalid email address'
                    return errors;
                }}
                onSubmit={this.onSignup}>
                <Form className="sign-login-form flex column align-center space-around">
                    <FaUserCircle />
                    <section>
                        <legend>Username *</legend>
                        <Field autoComplete="something" className="sign-login-input" type="text" name="username" />
                    </section>
                    <ErrorMessage name="username" component="span" />
                    <section>
                        <legend>Full name *</legend>
                        <Field autoComplete="something" className="sign-login-input" type="text" name="fullName" />
                    </section>
                    <ErrorMessage name="fullName" component="span" />
                    <section>
                        <legend>Email *</legend>
                        <Field autoComplete="something" className="sign-login-input" type="text" name="email" />
                    </section>
                    <ErrorMessage name="email" component="span" />
                    <section>
                        <legend>Password *</legend>
                        <Field autoComplete="something" className="sign-login-input" type="password" name="password" />
                    </section>
                    <ErrorMessage name="password" component="span" />
                    <section>
                        <legend>Confirm password *</legend>
                        <Field autoComplete="something" className="sign-login-input" type="password" name="confirm" />
                    </section>
                    <ErrorMessage name="confirm" component="span" />
                    <button type="submit">Signup</button>
                    <a href="/#/login">Already have an account? Login here!</a>
                    <button className="guest-button" onClick={this.onGuestLogin}>Or try as a guest!</button>
                </Form>
            </Formik>
            <div data-title="Back to home" className="go-back">
                <NavLink to="/"><FaArrowLeft /></NavLink>
            </div>
            <div className={`sign-login-err-modal flex justify-center align-center ${isErrSignup && "animate-sign-login-err-modal"}`}>
                <h2>{errMsg}</h2>
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
    signup,
    guestLogin,
    loadBoards
}
export const Signup = connect(mapStateToProps, mapDispatchToProps)(withRouter(_Signup));