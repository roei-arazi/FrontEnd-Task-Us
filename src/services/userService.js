let minUsers = [
    {
        _id: 'asfasdfqw12412das1wd',
        name: 'Roei',
        imgUrl: 'https://via.placeholder.com/150',
    },
    {
        _id: 'asfasdw12412d1wd',
        name: 'Osher',
        imgUrl: 'https://via.placeholder.com/150',
    },
    {
        _id: 'asfasdfqw12412d1',
        name: 'Liam',
        imgUrl: 'https://via.placeholder.com/150',
    },
    {
        _id: 'asfasdfq12d1wd',
        name: 'Goku',
        imgUrl: 'https://via.placeholder.com/150',
    }
]

export const userService = {
    loadUsers
}

async function loadUsers() {
    try {
        return JSON.parse(JSON.stringify(minUsers));
    } catch (err) {
        console.log('boardService: Coulnd\'t get user');
        throw err;
    }
}