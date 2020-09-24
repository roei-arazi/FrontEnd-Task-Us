import { userService } from "../../services/userService";
import socketService from '../../services/socketService.js';


export function loadUsers() {
    return async dispatch => {
        try {
            const users = await userService.loadUsers();
            dispatch({ type: 'SET_USERS', users })
        } catch (err) {
            console.log('userActions: Couldn\'t load users');
            throw err;
        }
    }
}

export function login(userCred) {
    return async dispatch => {
        try {
            const user = await userService.login(userCred);
            dispatch({ type: 'SET_USER', user })
        } catch (err) {
            console.log('userActions: Couldn\'t login');
            throw err;
        }
    }
}

export function signup(userCred) {
    return async dispatch => {
        try {
            const user = await userService.signup(userCred);
            dispatch({ type: 'SET_USER', user })
        } catch (err) {
            console.log('userActions: Couldn\'t signup');
            throw err;
        }
    }
}

export function guestLogin() {
    return async dispatch => {
        try {
            const user = await userService.guestLogin();
            dispatch({ type: 'SET_USER', user })
        } catch (err) {
            console.log('userActions: Couldn\'t login as a guest');
            throw err;
        }
    }
}

export function markAsRead(loggedUser) {
    return async dispatch => {
        try {
            const user = await userService.markAsRead(loggedUser);
            dispatch({ type: 'SET_USER', user })
        } catch (err) {
            console.log('userActions: Couldn\'t login as a guest');
            throw err;
        }
    }
}

export function removeNotifications(loggedUser) {
    const user = loggedUser
    user.notifications = []

    return async dispatch => {
        try {
            userService.updateUser(loggedUser)
            dispatch({ type: 'UPDATE_PROFILE', user })
        } catch (err) {
            console.log('ERROR, couldnt remove notifications', err);
        }
    }

}

export function updateUser(loggedUser) {
    return async dispatch => {
        try {
            userService.updateUser(loggedUser)
            dispatch({ type: 'SET_USER', user: loggedUser })
        } catch (err) {
            console.log('userActions: Couldn\'t update user');
            throw err;
        }
    }
}

export function logout() {
    return dispatch => {
        try {
            userService.logout();
            dispatch({ type: 'SET_USER', user: null })
        } catch (err) {
            console.log('userActions: Couldn\'t logout');
            throw err;
        }
    }
}
