import moment from 'moment'

export const boardService = {
    loadBoards,
    updateBoard,
    addGroup,
    removeGroup,
    addTask,
    removeTask,
    removeBoard
}

let boards = [{
    _id: '123',
    boardCreator: {
        _id: '12312',
        fullName: 'fullname mcgee',
        imgUrl: 'www.imgur.com/sasf'
    },
    name: 'board1',
    createdAt: moment().calendar(),
    description: 'Enter description here',
    members: [{
        _id: 'u101',
        fullname: 'shicks mcgee',
        imgUrl: 'imgure/sfasfa',
        lastSeen: 'yesterday'
    }],
    groups: [{
        id: _makeid(),
        name: 'week1',
        createdAt: 'date',
        color: 'blue',
        lastUpdated: 198465168486,
        isTagsShown: false,
        tags: [],
        columns: [{
            type: 'date',
            name: 'due date'
        }],
        tasks: [{
            id: _makeid(),
            name: 'sneeze',
            createdAt: 1123124124241,
            members: [{
                _id: 1234,
                name: 'osher',
                imgUrl: 'https://res.cloudinary.com/dtg7n0zye/image/upload/v1600347674/lkbdxs1hovtz82o97qqq.jpg'
            }],
            status: 'done',
            priority: 'low',
            dueDate: Date.now(),
            note: 'dont forget about this',
            lastUpdated: 'yesterday',
            isSelected: false,
            posts: [],
            tags: ['ui', 'ux'],
            attachedImgs: ['https://res.cloudinary.com/dtg7n0zye/image/upload/v1600008729/i70mbqxvm0qh1yeznsnf.jpg']
        },{
            id: _makeid(),
            name: 'sneeze',
            createdAt: 1123124124241,
            members: [{
                _id: 1234,
                name: 'osher',
                imgUrl: ''
            }],
            status: 'done',
            priority: 'low',
            dueDate: Date.now(),
            note: 'dont forget about this',
            lastUpdated: 'yesterday',
            isSelected: false,
            posts: [],
            tags: ['ui', 'ux'],
            attachedImgs: ['https://res.cloudinary.com/dtg7n0zye/image/upload/v1600008729/i70mbqxvm0qh1yeznsnf.jpg']
        }]
    }],
    activityLog: [{
        createdAt: 124124125124,
        byUser: {
            _id: 123,
            imgUrl: 'www.imgur',
            fullName: 'shucks mcgee'
        },
        description: 'removed task "do the dishes"',
        task: {
            id: 123,
            name: 'do the dishes'
        }
    },
    {
        createdAt: 12412541251,
        byUser: {
            _id: 123,
            imgUrl: 'www.imgur',
            fullName: 'shucks mcgee'
        },
        description: 'changed group name from project2 to project3',
        group: {
            id: 142,
            name: 'project3'
        }
    },
    {
        createdAt: 4514512352135,
        byUser: {
            _id: 123,
            imgUrl: 'www.imgur',
            fullName: 'shucks mcgee'
        },
        description: 'added group project2',
        group: {
            id: 142,
            name: 'project2'
        }
    }
    ]
},{
    _id: '23442',
    boardCreator: {
        _id: '12312',
        fullName: 'fullname mcgee',
        imgUrl: 'www.imgur.com/sasf'
    },
    name: 'board2',
    createdAt: moment().calendar(),
    description: 'Enter description here',
    members: [{
        _id: 'u101',
        fullname: 'shicks mcgee',
        imgUrl: 'imgure/sfasfa',
        lastSeen: 'yesterday'
    }],
    groups: [{
        id: _makeid(),
        name: 'week1',
        createdAt: 'date',
        color: 'blue',
        lastUpdated: 198465168486,
        isTagsShown: false,
        tags: [],
        columns: [{
            type: 'date',
            name: 'due date'
        }],
        tasks: [{
            id: _makeid(),
            name: 'sneeze',
            createdAt: 1123124124241,
            members: [{
                _id: 1234,
                name: 'osher',
                imgUrl: 'www/sfasf'
            }],
            status: 'stuck',
            priority: 'medium',
            dueDate: Date.now(),
            note: 'dont forget about this',
            lastUpdated: 'yesterday',
            isSelected: false,
            posts: [],
            tags: ['ui', 'ux'],
            attachedImgs: ["https://res.cloudinary.com/dtg7n0zye/image/upload/v1600008729/i70mbqxvm0qh1yeznsnf.jpg"]
        }]
    }],
    activityLog: [{
        createdAt: 124124125124,
        byUser: {
            _id: 123,
            imgUrl: 'www.imgur',
            fullName: 'shucks mcgee'
        },
        description: 'removed task "do the dishes"',
        task: {
            id: 123,
            name: 'do the dishes'
        }
    },
    {
        createdAt: 12412541251,
        byUser: {
            _id: 123,
            imgUrl: 'www.imgur',
            fullName: 'shucks mcgee'
        },
        description: 'changed group name from project2 to project3',
        group: {
            id: 142,
            name: 'project3'
        }
    },
    {
        createdAt: 4514512352135,
        byUser: {
            _id: 123,
            imgUrl: 'www.imgur',
            fullName: 'shucks mcgee'
        },
        description: 'added group project2',
        group: {
            id: 142,
            name: 'project2'
        }
    }
    ]
}]

async function loadBoards() {
    try {
        return JSON.parse(JSON.stringify(boards));
    } catch (err) {
        console.log('boardService: Coulnd\'t get board');
        throw err;
    }
}

async function updateBoard(boardToSave) {
    const newBoards = JSON.parse(JSON.stringify(boards))
    const idx = newBoards.findIndex(board => board._id === boardToSave._id)
    try { 
        newBoards.splice(idx, 1, boardToSave)
        return newBoards
    } catch (err) {
        console.log('boardService: Couldn\'t update board');
        throw err;
    }
}

async function removeBoard(boardId){
    console.log('deleting boardId:', boardId)
    try{
        boards = boards.filter(board => board._id !== boardId);
    }catch(err){
        console.log('boardService: Couldn\'t remove board');
        throw err;
    }
}

async function addGroup(boardId) {
    const group = {
        id: _makeid(),
        name: 'week1',
        createdAt: 'date',
        color: 'blue',
        lastUpdated: 198465168486,
        isTagsShown: false,
        tags: [],
        columns: [{
            type: 'date',
            name: 'due date'
        }],
        tasks: [{
            id: _makeid(),
            name: 'sneeze',
            createdAt: 1123124124241,
            members: [{
                _id: 1234,
                name: 'osher',
                imgUrl: 'www/sfasf'
            }],
            status: 'done/progress/stuck',
            priority: 1,
            dueDate: 214124124125,
            note: 'dont forget about this',
            lastUpdated: 'yesterday',
            isSelected: false,
            posts: [],
            tags: ['ui', 'ux'],
            attachedImgs: []
        }]
    }
    try {
        const boardIdx = boards.findIndex(board => board._id === boardId);
        boards[boardIdx].groups.push(group)
        // return Promise.resolve()
    } catch (err) {
        console.log('boardService: Couldn\'t add group');
        throw err;
    }
}

async function removeGroup(groupId) {
    boards = boards.map(board => {
        board.groups = board.groups.filter(group => group.id !== groupId)
        return board;
    })
}

async function removeTask(taskId) {
    boards = boards.map(board => {
        board.groups = board.groups.map(group => {
            group.tasks = group.tasks.filter(task => task.id === taskId)
            return group;
        })
        return board;
    })
}

async function addTask(groupId) {
    const task = {
        id: _makeid(),
        name: 'sneeze',
        createdAt: 1123124124241,
        members: [{
            _id: 1234,
            name: 'osher',
            imgUrl: 'www/sfasf'
        }],
        status: 'done/progress/stuck',
        priority: 1,
        dueDate: 214124124125,
        note: 'dont forget about this',
        lastUpdated: 'yesterday',
        isSelected: false,
        posts: [],
        tags: ['ui', 'ux'],
        attachedImgs: []
    }
    boards = boards.map(board => {
        board.groups = board.groups.map(group => {
            if (group.id === groupId) group.tasks.push(task)
            return group;
        })
        return board;
    })
}

function _makeid(length = 7) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}