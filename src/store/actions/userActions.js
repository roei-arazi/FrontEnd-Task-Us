import { userService } from "../../services/userService";


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

export function getUserById(userId) {
    return async dispatch => {
        try {

            const user = await userService.getUserById(userId);
            dispatch({ type: 'SHOW_PROFILE', user })
        } catch (err) {
            console.log('userActions: Couldn\'t load user');
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