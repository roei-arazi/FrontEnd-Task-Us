import {userService} from '../../services/userService'

const initialState = {
    users: [],
    loggedUser: userService.getCurrUser(),
    // loggedUser: {
    //     "_id": "5f68936cf878123b2cd354436ce96d",
    //     "username": "guest",
    //     "fullName": "Guest User",
    //     "password": "",
    //     "email": "guest@gmail.com",
    //     "imgUrl": "https://www.shareicon.net/data/2015/08/15/85434_guest_512x512.png",
    //     "notifications": [{
    //         "byUser": {
    //             "_id": "5f6c5f7e27ed4400175ce1ac",
    //             "imgUrl": "http://res.cloudinary.com/dtg7n0zye/image/upload/v1600938007/ybmioy3x7smnwhptho3x.jpg",
    //             "fullName": "Liam Zety"
    //         },
    //         "content": "Liam Zety Removed a you from the board Caljul20",
    //         "createdAt": Date.now() - 1000 * 60 * 2
    //     },
    //     {
    //         "byUser": {
    //             "_id": "5f6c5ef927ed4400175ce1a7",
    //             "imgUrl": "http://res.cloudinary.com/dtg7n0zye/image/upload/v1600937821/pd8tx7oddwp2wghsp9qt.jpg",
    //             "fullName": "Osher Kabeda"
    //         },
    //         "content": "board: Osher Kabeda Tasked you to task - Learn the ropes",
    //         "createdAt": Date.now() - 1000 * 60 * 3
    //     },
    //     {
    //         "byUser": {
    //             "_id": "5f6c5f0227ed4400175ce1aa",
    //             "imgUrl": "http://res.cloudinary.com/dtg7n0zye/image/upload/v1600937750/ztfvuok0olgwarb9kabo.jpg",
    //             "fullName": "Roei Arazi"
    //         },
    //         "content": "board: Roei Arazi Added you to the board - Caljul20",
    //         "createdAt": Date.now() - 1000 * 60 * 4
    //     }
    //     ]
    // },
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