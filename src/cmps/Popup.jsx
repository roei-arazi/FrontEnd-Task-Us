import { Snackbar, Button } from '@material-ui/core';
import React from 'react';
import { connect } from 'react-redux';

import { hideSnackbar } from '../store/actions/systemActions.js';

function _Popup(props){
    const {isSnackbarShown, snackbarShown} = props;
    return <Snackbar
    anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
    }}
    open={isSnackbarShown}
    autoHideDuration={3000}
    message={snackbarShown}
    action={<Button style={{color: '#f2f1dfb0'}} onClick={props.hideSnackbar}>Close</Button>}
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

export const Popup = connect(mapStateToProps, mapDispatchToProps)(_Popup)