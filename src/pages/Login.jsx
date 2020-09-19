import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { FaArrowLeft, FaUserCircle } from 'react-icons/fa';
import { Tooltip, Zoom } from '@material-ui/core';
import {login, signup, guestLogin} from '../store/actions/userActions.js'

class _Login extends Component {

    componentDidMount(){
        // if(this.props.loggedUser)   this.props.history.push('/board/123')
    }

    onLogin = async (values, {resetForm}) => {
        resetForm();
        await this.props.login(values);
        if(this.props.loggedUser)   this.props.history.push('/board/123')
    }

    onGuestLogin = async () =>{
        await this.props.guestLogin();
        this.props.history.push('/board/123')
    }

    render() {
        const initialValues = { username: '', password: '' }
        return <div className="login">
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
                <Form className="login-form flex column align-center space-around">
                    <FaUserCircle />
                    <label>
                        <legend>Username: </legend>
                        <Field className="login-input" label="Username:" type="text" name="username" />
                    </label>
                    <ErrorMessage name="username" component="span" />
                    <label>
                        <legend>Password: </legend>
                    <Field className="login-input" label="Password:" type="text" name="password" />
                    </label>
                    <ErrorMessage name="password" component="span" />
                    <button type="submit">Login</button>
                    <a href="/#/signup">Don't have an account? sign up here.</a>
                    <button onClick={this.onGuestLogin}>Or try as a guest!</button>
                </Form>
            </Formik>
            <Tooltip enterDelay={200} TransitionComponent={Zoom} title="Back to home" arrow>
                <div>
                    <NavLink to="/"><FaArrowLeft className="go-back" /></NavLink>
                </div>
            </Tooltip>
        </div>
    }
}

const mapStateToProps = state => {
    return {
        loggedUser: state.userReducer.loggedUser
    }
}

const mapDispatchToProps = {
    login,
    signup,
    guestLogin
}

export const Login = connect(mapStateToProps, mapDispatchToProps)(withRouter(_Login));