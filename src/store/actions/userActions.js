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

export function getUserById(userId){
    return async dispatch =>{
        try{
            
            const user= await userService.getUserById(userId);
            dispatch({type: 'SHOW_PROFILE', user})
        }catch (err) {
            console.log('userActions: Couldn\'t load user');
            throw err;
        }
    }
}