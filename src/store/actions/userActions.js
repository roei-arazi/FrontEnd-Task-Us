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