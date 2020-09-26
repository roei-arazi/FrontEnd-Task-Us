const initialState = {
    users: [],
    loggedUser: {      
            "_id" : "5f68936cf878123b2cd354436ce96d",
            "username" : "guest",
            "fullName" : "guest",
            "password" : "",
            "email" : "guest@gmail.com",
            "notifications" : [ ],
            "imgUrl": "https://www.shareicon.net/data/2015/08/15/85434_guest_512x512.png"
    },
    userProfile: null
}

export function userReducer(state = initialState, action) {
    switch (action.type) {
        case 'SET_USERS':
            return {
                ...state,
                users: action.users
            }
        case 'SHOW_PROFILE':
            return {
                ...state,
                userProfile: action.user
            }
        case 'SET_USER':
            return {
                ...state,
                loggedUser: action.user
            }
        default:
            return state
    }
}