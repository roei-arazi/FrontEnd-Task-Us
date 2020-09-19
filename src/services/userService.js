let users = [{
        _id: 'asfasdfq12d1wd',
        username: 'frize',
        fullName: 'Roei Arazi',
        password: '3333',
        email: 'frize@gmail.com',
        imgUrl: 'https://via.placeholder.com/100',
        isAdmin: true,
        boards: [{ id: '212', name: 'board1' }],
        notifications: [],
        birthDay: '2nd August 1997',
        company: 'adidas',
        phoneNumber: '0224132124'
    },
    {
        _id: 'asfasdfqw12412d1',
        username: 'anstrio',
        fullName: 'Osher Kabada',
        password: '2222',
        email: 'anstrio@gmail.com',
        imgUrl: 'https://via.placeholder.com/100',
        isAdmin: true,
        boards: [{ id: '212', name: 'board1' }],
        notifications: [],
        birthDay: '2nd August 1997',
        company: 'adidas',
        phoneNumber: '0224127124'
    },
    {
        _id: 'asfasdw12412d1wd',
        username: 'smoking',
        fullName: 'Liam Zety',
        password: '1111',
        email: 'smoking@gmail.com',
        imgUrl: 'https://via.placeholder.com/100',
        isAdmin: true,
        boards: [{ id: '212', name: 'board1' }],
        notifications: [],
        birthDay: '2nd August 1997',
        company: 'adidas',
        phoneNumber: '0224112124'
    }
]

export const userService = {
    loadUsers,
    getUserById,
    login,
    signup,
    guestLogin
}

async function loadUsers() {
    try {
        return JSON.parse(JSON.stringify(users));
    } catch (err) {
        console.log('userService: Coulnd\'t get users');
        throw err;
    }
}

async function getUserById(userId) {
    const user = users.find(user => user._id === userId)
    try {
        return user
    } catch (err) {
        console.log('userService: Coulnd\'t get user');
        throw err;
    }
}

async function login(userCred) {
    try {
        const user = users.find(user => user.username === userCred.username && user.password === userCred.password);
        if (!user) throw 'Wrong username or password'
        return user;
    } catch (err) {
        console.log('userService: Wrong username or password');
        throw err;
    }
}

async function signup(userCred) {
    const user = {
        _id: _makeid(),
        imgUrl: 'https://via.placeholder.com/100',
        isAdmin: true,
        boards: [{ id: '212', name: 'board1' }],
        notifications: [],
        birthDay: '2nd August 1997',
        company: 'adidas',
        phoneNumber: '0224132124',
        ...userCred
    }
    users.push(user);
}

async function guestLogin() {
    const user = {
        _id: _makeid(),
        username: 'guest',
        fullName: 'guest mcgee',
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
        users.push(user);
        return user
    }catch (err) {
        console.log('userService: Couldn\'t login as guest');
        throw err;
    }
}

function _makeid(length = 7) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}