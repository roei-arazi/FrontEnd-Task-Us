export const boardService = {
    loadBoard,
    updateBoard,
    addGroup
}

let boards = [{
    _id: 123,
    boardCreator: {
        _id: 12312,
        fullName: 'fullname mcgee',
        imgUrl: 'www.imgur.com/sasf'
    },
    name: 'board1',
    createdAt: 24124135124,
    description: 'Enter description here',
    members: [{
        _id: 'u101',
        fullname: 'shicks mcgee',
        imgUrl: 'imgure/sfasfa',
        lastSeen: 'yesterday'
    }],
    groups: [{
        _id: 124,
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
            id: 21412,
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

async function loadBoard(id) {
    try {
        return board.find(board => board._id === id);
    } catch (err) {
        console.log('boardService: Coulnd\'t get board');
        throw err;
    }
}

async function updateBoard(boardToSave) {
    try {
        board = boardToSave;
    } catch (err) {
        console.log('boardService: Couldn\'t update board');
        throw err;
    }
}

async function addGroup(boardId) {
    const group = {
        _id: 124,
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
            id: 21412,
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
    } catch (err) {
        console.log('boardService: Couldn\'t add group');
        throw err;
    }
}