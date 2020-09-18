let minUsers = [
    {
    _id: 'asfasdfqw12412das1wd',
    name: 'Roei',
    imgUrl: 'www.imgur.com/asfasf',
},
{
    _id: 'asfasdw12412d1wd',
    name: 'Osher',
    imgUrl: 'www.imgur.com/asfasf',
},
{
    _id: 'asfasdfqw12412d1',
    name: 'Liam',
    imgUrl: 'www.imgur.com/asfasf',
},
{
    _id: 'asfasdfq12d1wd',
    name: 'Goku',
    imgUrl: 'www.imgur.com/asfasf',
}
]

export const userService={
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