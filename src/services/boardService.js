import moment from 'moment'

export const boardService = {
    loadBoards,
    updateBoard,
    addGroup,
    removeGroup,
    addTask,
    removeTask,
    removeBoard,
    addBoard
}

let boards = [{
    _id: '123',
    boardCreator: {
        _id: 'asfasdw12412d1wd',
        fullName: 'Liam Zety',
        imgUrl: 'https://via.placeholder.com/100',
    },
    name: 'board1',
    createdAt: moment().calendar(),
    description: 'Enter description here',
    members: [],
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
                _id: 'asfasdw12412d1wd',
                fullName: 'Liam Zety',
                imgUrl: 'https://via.placeholder.com/100',
            }],
            status: 'Done',
            priority: 'low',
            dueDate: Date.now() + 1000 * 60 * 60 * 24 * 3,
            updates: [
                {
                    txt: 'dont forget about this',
                    member: 'Roei Arazi'
                },
                {
                    txt: 'https://res.cloudinary.com/dtg7n0zye/image/upload/v1600008729/i70mbqxvm0qh1yeznsnf.jpg',
                    member: 'Liam Zety'
                }
            ],
            lastUpdated: 'yesterday',
            isSelected: false,
            posts: [],
            tags: ['ui', 'ux'],
            attachedImgs: []
        }, {
            id: _makeid(),
            name: 'sneeze',
            createdAt: 1123124124241,
            members: [{
                _id: 'asfasdfq12d1wd',
                fullName: 'Roei Arazi',
                imgUrl: 'https://via.placeholder.com/100',
            }],
            status: 'Stuck',
            priority: 'low',
            dueDate: Date.now() + 1000 * 60 * 60 * 24 * 2,
            updates: [
                {
                    txt: 'dont forget about this',
                    member: 'Roei Arazi'
                },
                {
                    txt: 'https://res.cloudinary.com/dtg7n0zye/image/upload/v1600008729/i70mbqxvm0qh1yeznsnf.jpg',
                    member: 'Liam Zety'
                }
            ],
            lastUpdated: 'yesterday',
            isSelected: false,
            posts: [],
            tags: ['ui', 'ux']
        }]
    }],
    activityLog: [{
        createdAt: 124124125124,
        id: _makeid(),
        byUser: {
            _id: 'asfasdw12412d1wd',
            fullName: 'Liam Zety',
            imgUrl: 'https://via.placeholder.com/100',
        },
        description: 'removed task "do the dishes"',
        task: {
            id: 123,
            name: 'do the dishes'
        }
    },
    {
        createdAt: 12412541251,
        id: _makeid(),
        byUser: {
            _id: 'asfasdw12412d1wd',
            fullName: 'Liam Zety',
            imgUrl: 'https://via.placeholder.com/100',
        },
        description: 'changed group name from project2 to project3',
        group: {
            id: 142,
            name: 'project3'
        }
    },
    {
        createdAt: 4514512352135,
        id: _makeid(),
        byUser: {
            _id: 'asfasdw12412d1wd',
            fullName: 'Liam Zety',
            imgUrl: 'https://via.placeholder.com/100',
        },
        description: 'added group project2',
        group: {
            id: 142,
            name: 'project2'
        }
    }
    ]
}, {
    _id: '23442',
    boardCreator: {
        _id: 'asfasdw12412d1wd',
        fullName: 'Liam Zety',
        imgUrl: 'https://via.placeholder.com/100',
    },
    name: 'board2',
    createdAt: moment().calendar(),
    description: 'Enter description here',
    members: [],
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
                _id: 'asfasdfqw12412d1',
                fullName: 'Osher Kabada',
                imgUrl: 'https://via.placeholder.com/100',
            }],
            status: 'stuck',
            priority: 'medium',
            dueDate: Date.now() + 1000 * 60 * 60 * 24,
            updates: [
                {
                    txt: 'dont forget about this',
                    member: 'Roei Arazi'
                },
                {
                    txt: 'https://res.cloudinary.com/dtg7n0zye/image/upload/v1600008729/i70mbqxvm0qh1yeznsnf.jpg',
                    member: 'Liam Zety'
                }
            ],
            lastUpdated: 'yesterday',
            isSelected: false,
            posts: [],
            tags: ['ui', 'ux']
        },]
    },],
    activityLog: [{
        id: _makeid(),
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
        id: _makeid(),
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
        id: _makeid(),
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
    },
    {
        id: _makeid(),
        createdAt: 2514512352135,
        byUser: {
            _id: 123,
            imgUrl: 'www.imgur',
            fullName: 'sfafa mcgee'
        },
        description: 'added group project2 lorem245252525225lorem245252525225lorem245252525225lorem245252525225lorem245252525225lorem245252525225lorem245252525225lorem245252525225',
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

async function updateBoard(boardToSave, filterBy) {
    const newBoards = JSON.parse(JSON.stringify(boards))

    if (filterBy.groupId) {
        boardToSave.groups.filter(group => group.id === filterBy.groupId)

    }

    const idx = newBoards.findIndex(board => board._id === boardToSave._id)
    try {
        newBoards.splice(idx, 1, boardToSave)
        return newBoards
    } catch (err) {
        console.log('boardService: Couldn\'t update board');
        throw err;
    }
}

async function removeBoard(boardId) {
    console.log('deleting boardId:', boardId)
    try {
        boards = boards.filter(board => board._id !== boardId);
    } catch (err) {
        console.log('boardService: Couldn\'t remove board');
        throw err;
    }
}

async function addBoard() {
    const board = {
        _id: _makeid(),
        boardCreator: {
            _id: 'asfasdw12412d1wd',
            fullName: 'Liam Zety',
            imgUrl: 'https://via.placeholder.com/100',
        },
        name: `board ${boards.length + 1}`,
        createdAt: moment().calendar(),
        description: 'Enter description here',
        members: [{
            _id: 'asfasdw12412d1wd',
            fullName: 'Liam Zety',
            imgUrl: 'https://via.placeholder.com/100',
        }],
        groups: [{
            id: _makeid(),
            name: 'group 1',
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
                    _id: 'asfasdfq12d1wd',
                    fullName: 'Roei Arazi',
                    imgUrl: 'https://via.placeholder.com/100',
                }],
                status: 'Stuck',
                priority: 'low',
                dueDate: Date.now(),
                updates: [
                    {
                        txt: 'dont forget about this',
                        member: 'Roei Arazi'
                    },
                    {
                        txt: 'https://res.cloudinary.com/dtg7n0zye/image/upload/v1600008729/i70mbqxvm0qh1yeznsnf.jpg',
                        member: 'Liam Zety'
                    }
                ],
                lastUpdated: 'yesterday',
                isSelected: false,
                posts: [],
                tags: ['ui', 'ux']
            }, {
                id: _makeid(),
                name: 'sneeze',
                createdAt: 1123124124241,
                members: [{
                    _id: 'asfasdfq12d1wd',
                    fullName: 'Roei Arazi',
                    imgUrl: 'https://via.placeholder.com/100',
                }],
                status: 'Working on it',
                priority: 'low',
                dueDate: Date.now(),
                updates: [
                    {
                        txt: 'dont forget about this',
                        member: 'Roei Arazi'
                    },
                    {
                        txt: 'https://res.cloudinary.com/dtg7n0zye/image/upload/v1600008729/i70mbqxvm0qh1yeznsnf.jpg',
                        member: 'Liam Zety'
                    }
                ],
                lastUpdated: 'yesterday',
                isSelected: false,
                posts: [],
                tags: ['ui', 'ux']
            }]
        }],
        activityLog: [{
            id: _makeid(),
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
    }
    try {
        boards.push(board);
    } catch (err) {
        console.log('boardService: Couldn\'t add board');
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
            status: 'Working on it',
            priority: 'low',
            dueDate: 214124124125,
            updates: [
                {
                    txt: 'dont forget about this',
                    member: 'Roei Arazi'
                },
                {
                    txt: 'https://res.cloudinary.com/dtg7n0zye/image/upload/v1600008729/i70mbqxvm0qh1yeznsnf.jpg',
                    member: 'Liam Zety'
                }
            ],
            lastUpdated: 'yesterday',
            isSelected: false,
            posts: [],
            tags: ['ui', 'ux']
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

async function addTask(groupId, taskName = 'Change Task Name') {
    const task = {
        id: _makeid(),
        name: taskName,
        createdAt: 1123124124241,
        members: [{
            _id: 1234,
            name: 'osher',
            imgUrl: 'www/sfasf'
        }],
        status: 'Done',
        priority: 'low',
        dueDate: 214124124125,
        updates: [
            {
                txt: 'dont forget about this',
                member: 'Roei Arazi'
            },
            {
                txt: 'https://res.cloudinary.com/dtg7n0zye/image/upload/v1600008729/i70mbqxvm0qh1yeznsnf.jpg',
                member: 'Liam Zety'
            }
        ],
        lastUpdated: 'yesterday',
        isSelected: false,
        posts: [],
        tags: ['ui', 'ux']
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