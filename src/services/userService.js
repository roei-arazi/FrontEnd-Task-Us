import httpService from './httpService';
import socketService from './socketService'

// let users = [{
//     "username": 'frize',
//     "fullName": 'Roei Arazi',
//     "password": '3333',
//     "email": 'frize@gmail.com',
//     "imgUrl": 'https://via.placeholder.com/250',
//     "isAdmin": true,
//     "boards": [],
//     "notifications": [],
//     "birthDay": '2nd August 1997',
//     "company": 'adidas',
//     "phoneNumber": '0224132124'
// },
// {
//     "username": 'anstrio',
//     "fullName": 'Osher Kabada',
//     "password": '2222',
//     "email": 'anstrio@gmail.com',
//     "imgUrl": 'https://via.placeholder.com/250',
//     "isAdmin": true,
//     "boards": [],
//     "notifications": [],
//     "birthDay": '2nd August 1997',
//     "company": 'adidas',
//     "phoneNumber": '0224127124'
// },
// {
//     "username": 'smoking',
//     "fullName": 'Liam Zety',
//     "password": '1111',
//     "email": 'smoking@gmail.com',
//     "imgUrl": 'https://via.placeholder.com/250',
//     "isAdmin": true,
//     "boards": [],
//     "notifications": [],
//     "birthDay": '2nd August 1997',
//     "company": 'adidas',
//     "phoneNumber": '0224112124'
// }
// ]

export const userService = {
    loadUsers,
    getUserById,
    login,
    signup,
    guestLogin,
    markAsRead,
    updateUser,
    logout,
    notifyUsers
}

async function loadUsers() {
    try {
        const users = await httpService.get('user')
        return users;
    } catch (err) {
        console.log('userService: Coulnd\'t get users');
        throw err;
    }
}

async function markAsRead(loggedUser) {
    loggedUser.notifications.forEach(notification => {
        notification.isRead = true
    })
    updateUser(loggedUser)
    try {
        return loggedUser

    } catch (err) {
        console.log('userService: Something went wrong');
        throw err;
    }
}

async function getUserById(userId) {
    console.log('got to user service', userId);
    try {
        const user = await httpService.get(`user/${userId}`);
        console.log('got from service:', user);
        return user
    } catch (err) {
        console.log('userService: Coulnd\'t get user');
        throw err;
    }
}

async function login(userCred) {
    try {
        // const user = users.find(user => user.username === userCred.username && user.password === userCred.password);
        const user = await httpService.post('auth/login', userCred);
        if (!user) throw 'Wrong username or password'
        return _handleLogin(user)
    } catch (err) {
        console.log('userService: Wrong username or password');
        throw err;
    }
}

async function signup(userCred) {
    const user = {
        imgUrl: 'https://via.placeholder.com/100',
        isAdmin: true,
        boards: [],
        notifications: [],
        birthDay: '2nd August 1997',
        company: 'adidas',
        phoneNumber: '0224132124',
        ...userCred
    }
    try {
        const newUser = await httpService.post('auth/signup', user)
        return _handleLogin(newUser)
    } catch (err) {
        console.log('userService: Couldn\'t sign up');
        throw err;
    }
}

async function guestLogin() {
    const user = {
        _id: _makeid(),
        username: 'guest',
        fullName: 'Guest User',
        password: 'none',
        imgUrl: 'https://via.placeholder.com/100',
        isAdmin: true,
        boards: [{ id: '212', name: 'board1' }],
        notifications: [],
        birthDay: '2nd August 1997',
        company: 'adidas',
        phoneNumber: '0224132124',

    }
    try {
        // users.push(user);
        return user
    } catch (err) {
        console.log('userService: Couldn\'t login as guest');
        throw err;
    }
}


async function updateUser(user) {
    httpService.put(`user/${user._id}`, user)
    return user
}

async function logout() {
    await httpService.post('auth/logout');
    sessionStorage.clear();
}

async function notifyUsers(content, members, loggedUser) {
    console.log('got user in service:', loggedUser);
    const users = await loadUsers();
    if (members === 'add') members = [...users]
    const notification = {
        byUser: {
            fullName: loggedUser.fullName,
            imgUrl: loggedUser.imgUrl
        },
        content,
        createdAt: Date.now()
    }
    members.forEach(member => {
        if (member._id === loggedUser._id) return;
        let userToUpdate = users.find(user => user._id === member._id);
        if (!userToUpdate) {
            console.log('can\'t updated user:', userToUpdate);
            return;
        }
        userToUpdate.notifications.unshift(notification);
        userService.updateUser(userToUpdate);
        socketService.emit('send-notif', { userId: member._id, notification });
    })
}

function _handleLogin(user) {
    sessionStorage.setItem('user', JSON.stringify(user))
    return user;
}

function _makeid(length = 7) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
