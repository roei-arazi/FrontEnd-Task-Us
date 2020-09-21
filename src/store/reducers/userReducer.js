const initialState = {
    users: [],
    loggedUser: {      
            "_id" : "5f68936cf878123b2cdce96d",
            "username" : "frize",
            "fullName" : "Roei Arazi",
            "password" : "3333",
            "email" : "frize@gmail.com",
            "imgUrl" : "https://via.placeholder.com/250",
            "isAdmin" : true,
            "boards" : [],
            "notifications" : [ 
                {
                byUser: 
                {
                    fullName: "Liam Zety","imgUrl" : "https://via.placeholder.com/250" 
                },
                content:"just uploaded the logo!",
                createdAt:Date.now()
            }],
            "birthDay" : "2nd August 1997",
            "company" : "adidas",
            "phoneNumber" : "0224132124"
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