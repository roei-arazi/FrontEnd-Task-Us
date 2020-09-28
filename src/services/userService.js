import httpService from './httpService';
import socketService from './socketService'

export const userService = {
    loadUsers,
    getUserById,
    login,
    signup,
    guestLogin,
    markAsRead,
    updateUser,
    logout,
    notifyUsers,
    getCurrUser
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
    try {
        const user = await httpService.get(`user/${userId}`);
        return user
    } catch (err) {
        console.log('userService: Coulnd\'t get user');
        throw err;
    }
}
async function login(userCred) {
    try {
        console.log('USEr?', userCred)
        const user = await httpService.post('auth/login', userCred);
        return _handleLogin(user)
    } catch (err) {
        console.log('userService: Wrong username or password');
        throw err;
    }
}
async function signup(userCred) {
    const user = {
        isAdmin: false,
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
    try {
        const user = await login({ username: 'guest', password: '12345' });
        user.notifications = [{
            byUser: {
                _id: '5f6c5f7e27ed4400175ce1ac',
                imgUrl: 'http://res.cloudinary.com/dtg7n0zye/image/upload/v1600938007/ybmioy3x7smnwhptho3x.jpg',
                fullName: 'Liam Zety'
            },
            content: 'Liam Zety Removed a you from the board Caljul20',
            createdAt: Date.now() - 1000 * 60 * 2
        },
        {
            byUser: {
                _id: '5f6c5ef927ed4400175ce1a7',
                imgUrl: 'http://res.cloudinary.com/dtg7n0zye/image/upload/v1600937821/pd8tx7oddwp2wghsp9qt.jpg',
                fullName: 'Osher Kabeda'
            },
            content: 'board: Osher Kabeda Tasked you to task - Learn the ropes',
            createdAt: Date.now() - 1000 * 60 * 3
        },
        {
            byUser: {
                _id: '5f6c5f0227ed4400175ce1aa',
                imgUrl: 'http://res.cloudinary.com/dtg7n0zye/image/upload/v1600937750/ztfvuok0olgwarb9kabo.jpg',
                fullName: 'Roei Arazi'
            },
            content: 'board: Roei Arazi Added you to the board - Caljul20',
            createdAt: Date.now() - 1000 * 60 * 4
        }
        ]
        return user
    } catch (err) {
        console.log('userService: Couldn\'t login as guest');
        throw err;
    }
}
async function updateUser(user) {
    const updatedUser = await httpService.put(`auth/update/${user._id}`, user)
    console.log('updated user:', updatedUser)
    return updatedUser
}
async function logout() {
    await httpService.post('auth/logout');
    sessionStorage.clear();
}
function getCurrUser() {
    const user = JSON.parse(sessionStorage.getItem('user'));
    return user;
}
async function notifyUsers(content, members, loggedUser) {
    const users = await loadUsers();
    if (members === 'add') members = [...users]
    const notification = {
        byUser: {
            _id: loggedUser._id,
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
