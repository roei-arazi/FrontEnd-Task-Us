const initialState={
    user:{}
}

export function userReducer(state=initialState, action){
    switch (action.type) {
        case 'SET_USERS':
            return{
                ...state,
                users:action.users
            }
    
        default:
            return state
    }
}