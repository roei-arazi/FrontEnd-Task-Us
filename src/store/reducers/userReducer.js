const initialState = {
    users: [],
    loggedUser: {
        _id: 'asfasdfq12d1wd',
        username: 'frize',
        fullName: 'Roei Arazi',
        password: '3333',
        email: 'frize@gmail.com',
        imgUrl: 'https://via.placeholder.com/100',
        isAdmin: true,
        boards: [{ id: '212', name: 'board1' }],
        notifications: [
            { isRead: false, content: "notification liam" },
            { isRead: false, content: "notification doll" }
        ],
        birthDay: '2nd August 1997',
        company: 'adidas',
        phoneNumber: '0224132124'
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