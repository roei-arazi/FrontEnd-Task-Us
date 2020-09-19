import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';

class _Login extends Component {

    onLogin = () => {

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
                onSubmit={this.onSubmit}
            >
                <Form className="login-form flex column align-center space-around">
                    <h2>Login</h2>
                    <Field label="Username:" type="text" name="username" />
                    <ErrorMessage name="username" component="span" />
                    <Field label="Password:" type="text" name="password" />
                    <ErrorMessage name="password" component="span" />
                    <button type="submit">Login</button>
                    <a href="/#/signup">Don't have an account? sign up here.</a>
                </Form>
            </Formik>
        </div>
    }
}

const mapStateToProps = state => {
    return {

    }
}

const mapDispatchToProps = {

}

export const Login = connect(mapStateToProps, mapDispatchToProps)(_Login);