import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { FaArrowLeft, FaUserCircle } from 'react-icons/fa';
import { Tooltip, Zoom } from '@material-ui/core';
import {signup, guestLogin} from '../store/actions/userActions.js'

class _Signup extends Component {

    componentDidMount(){
        // if(this.props.loggedUser)   this.props.history.push('/board/123')
    }

    onSignup = async (values, {resetForm}) => {
        resetForm();
        const {username, password, email} = values;
        await this.props.signup({username, password, email});
        if(this.props.loggedUser)   this.props.history.push('/board/123')
    }

    onGuestLogin = async () =>{
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
                    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    if (!formValues.username) errors.username = 'Required';
                    if (!formValues.password) errors.password = 'Required';
                    if (formValues.confirm !== formValues.password) errors.confirm = 'Doesn\'t match password';
                    if (!re.test(formValues.email.toLowerCase())) errors.email = 'Invalid email address'
                    return errors;
                }}
                onSubmit={this.onSignup}
            >
                <Form className="sign-login-form flex column align-center space-around">
                    <FaUserCircle />
                    <section>
                        <legend>Username *</legend>
                        <Field className="sign-login-input"type="text" name="username" />
                    </section> 
                    <section>
                        <legend>Email *</legend>
                        <Field className="sign-login-input" type="text" name="email" />
                    </section>
                    <ErrorMessage name="email" component="span" />
                    <section>
                        <legend>Password *</legend>
                    <Field className="sign-login-input" type="text" name="password" />
                    </section>
                    <ErrorMessage name="password" component="span" />
                    <section>
                        <legend>Confirm password *</legend>
                    <Field className="sign-login-input" type="text" name="confirm" />
                    </section>
                    <ErrorMessage name="confirm" component="span" />
                    <button type="submit">Signup</button>
                    <a href="/#/login">Already have an account? Login here!</a>
                    <button onClick={this.onGuestLogin}>Or try as a guest!</button>
                </Form>
            </Formik>
            <Tooltip enterDelay={200} TransitionComponent={Zoom} title="Back to home" arrow>
                <div className="go-back">
                    <NavLink to="/"><FaArrowLeft /></NavLink>
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
    signup,
    guestLogin
}

export const Signup = connect(mapStateToProps, mapDispatchToProps)(withRouter(_Signup));