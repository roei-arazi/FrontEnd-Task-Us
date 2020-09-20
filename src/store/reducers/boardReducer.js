const initialState = {
    boards: [],
    filterBy: {},
    isBoardbarShown: true
}

export function boardReducer(state = initialState, action) {
    switch (action.type) {
        case 'SET_BOARDS':
            return {
                ...state,
                boards: action.boards
            }
        case 'ADD_GROUP':
            return {
                ...state,
                boards: state.boards.map(board => {
                    if (board._id === action.boardId) board.groups.push({
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
                            priority: 'Low',
                            dueDate: 214124124125,
                            updates:[],
                            lastUpdated: 'yesterday',
                            isSelected: false,
                            posts: [],
                            tags: ['ui', 'ux']
                        }]
                    })
                    return board;
                })
            }
        case 'REMOVE_GROUP':
            return {
                ...state,
                boards: state.boards.map(board => {
                    board.groups = board.groups.filter(group => group.id !== action.groupId)
                    return board;
                })
            }
        case 'EDIT_GROUP':
            return {
                ...state,
                boards: state.boards.map(board => {
                    board.groups = board.groups.map(group => group.id === action.group.id ? action.group : group)
                    return board;
                })
            }
        case 'ADD_TASK':
            return {
                ...state,
                boards: state.boards.map(board => {
                    board.groups.map(group => {
                        if (group.id === action.groupId) group.tasks.push({
                            id: _makeid(),
                            name: action.taskName,
                            createdAt: 1123124124241,
                            members: [{
                                _id: 'asfasdw12412d1wd',
                                fullName: 'Liam Zety',
                                imgUrl: 'https://via.placeholder.com/100',
                            }],
                            status: 'progress',
                            priority: 'Low',
                            dueDate: 214124124125,
                            updates:[],
                            lastUpdated: 'yesterday',
                            isSelected: false,
                            posts: [],
                            tags: ['ui', 'ux']
                        })
                        return group;
                    })
                    return board;
                })
            }
        case 'REMOVE_TASK':
            return {
                ...state,
                boards: state.boards.map(board => {
                    board.groups.map(group => {
                        group.tasks = group.tasks.filter(task => task.id !== action.taskId)
                        return group;
                    })
                    return board;
                })
            }
        case 'EDIT_TASK':
            return {
                ...state,
                boards: state.boards.map(board => {
                    board.groups = board.groups.map(group => {
                        group.tasks = group.tasks.map(task => task.id === action.task.id ? action.task : task);
                        return group;
                    })
                    return board;
                })
            }
        case 'SET_BOARD':
            return {
                ...state,
                boards: action.boards
            }
        case 'REMOVE_BOARD':
            return {
                ...state,
                boards: state.boards.filter(board => board._id !== action.boardId)
            }
        case 'ADD_BOARD':
            return {
                ...state,
                boards: [...state.boards, {
                    _id: _makeid(),
                    boardCreator: {
                        _id: '12312',
                        fullName: 'fullname mcgee',
                        imgUrl: 'www.imgur.com/sasf'
                    },
                    name: `board ${state.boards.length + 1}`,
                    createdAt: Date.now(),
                    description: 'Enter description here',
                    members: [{
                        _id: 'u101',
                        fullname: 'shicks mcgee',
                        imgUrl: 'imgure/sfasfa',
                        lastSeen: 'yesterday'
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
                                _id: 1234,
                                name: 'osher',
                                imgUrl: 'https://res.cloudinary.com/dtg7n0zye/image/upload/v1600347674/lkbdxs1hovtz82o97qqq.jpg'
                            }],
                            status: 'Done',
                            priority: 'Low',
                            dueDate: Date.now(),
                            updates:[{
                                txt:'https://res.cloudinary.com/dtg7n0zye/image/upload/v1600008729/i70mbqxvm0qh1yeznsnf.jpg',
                                member: 'Osher Kabada'
                            }],
                            lastUpdated: 'yesterday',
                            isSelected: false,
                            posts: [],
                            tags: ['ui', 'ux']
                        }, {
                            id: _makeid(),
                            name: 'sneeze',
                            createdAt: 1123124124241,
                            members: [{
                                _id: 1234,
                                name: 'osher',
                                imgUrl: ''
                            }],
                            status: 'Donw',
                            priority: 'Low',
                            dueDate: Date.now(),
                            updates:[{
                                txt:'https://res.cloudinary.com/dtg7n0zye/image/upload/v1600008729/i70mbqxvm0qh1yeznsnf.jpg',
                                member:'Osher Kabada'
                            }],
                            lastUpdated: 'yesterday',
                            isSelected: false,
                            posts: [],
                            tags: ['ui', 'ux']
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
            }
        case 'SET_FILTER':
            return {
                ...state,
                filterBy: action.filter
            }
        case 'TOGGLE_BOARDBAR':
            return {
                ...state,
                isBoardbarShown: !state.isBoardbarShown
            }
        default:
            return state
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