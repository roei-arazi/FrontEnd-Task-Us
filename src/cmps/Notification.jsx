import { Snackbar, Button } from '@material-ui/core';
import React from 'react';
import { connect } from 'react-redux';

import { hideSnackbar } from '../store/actions/systemActions.js';

function _Notification(props){
    const {isSnackbarShown} = props;
    return <Snackbar
    anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
    }}
    open={isSnackbarShown}
    autoHideDuration={3000}
    message="Board deleted."
    action={<Button color="primary" onClick={props.hideSnackbar}>Close</Button>}
/>
}

const mapStateToProps = state => {
    return {
        isSnackbarShown: state.systemReducer.isSnackbarShown,
        snackbarShown: state.systemReducer.snackbarTxt
    }
}

const mapDispatchToProps = {
    hideSnackbar
}

export const Notification = connect(mapStateToProps, mapDispatchToProps)(_Notification)