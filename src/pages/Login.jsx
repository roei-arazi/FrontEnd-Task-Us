import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { FaArrowLeft, FaUserCircle } from 'react-icons/fa';

import { login, guestLogin } from '../store/actions/userActions.js'
import { loadBoards } from '../store/actions/boardActions'

class _Login extends Component {

    componentDidMount() {
        this.props.loadBoards()
    }

    onLogin = async (values, { resetForm }) => {
        resetForm();
        await this.props.login(values);
        if (this.props.loggedUser) this.props.history.push(`/board/${this.props.boards[0]._id}`)
    }

    onGuestLogin = async () => {
        await this.props.guestLogin();
        this.props.history.push(`/board/${this.props.boards[0]._id}`)
    }

    render() {
        const initialValues = { username: '', password: '' }
        return <div className="sign-login">
            <Formik
                initialValues={initialValues}

                validate={formValues => {
                    const errors = {};
                    if (!formValues.username) errors.username = 'Required';
                    if (!formValues.password) errors.password = 'Required';
                    return errors;
                }}
                onSubmit={this.onLogin}
            >
                <Form className="sign-login-form flex column align-center space-around">
                    <FaUserCircle />
                    <section>
                        <legend>Username *</legend>
                        <Field className="sign-login-input" type="text" name="username" />
                    </section>
                    <ErrorMessage name="email" component="span" />
                    <section>
                        <legend>Password *</legend>
                        <Field className="sign-login-input" type="password" name="password" />
                    </section>
                    <ErrorMessage name="password" component="span" />
                    <button type="submit">Login</button>
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
    loadBoards
}

export const Login = connect(mapStateToProps, mapDispatchToProps)(withRouter(_Login));