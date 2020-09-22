import httpService from './httpService'
import socketService from './socketService';

export const boardService = {
    loadBoards,
    addBoard,
    removeBoard,
    updateBoard,
    addGroup,
    removeGroup,
    updateGroup,
    addTask,
    removeTask,
    updateTask
}

async function loadBoards() {
    const boards = await httpService.get(`board`)
    return boards
}

function updateBoard(boardToSave, echo = true) {
    if (echo) socketService.emit('updateBoard', boardToSave);
    httpService.put(`board/${boardToSave._id}`, boardToSave)
    return boardToSave
}

function removeBoard(boardId) {
    return httpService.delete(`board/${boardId}`)
}

async function addBoard() {
    const board = {
        boardCreator: {
            "fullName": 'Liam Zety',
            "imgUrl": 'https://via.placeholder.com/100',
        },
        "name": "board",
        "createdAt": 198465168486,
        "description": 'Enter description here',
        "members": [{
            "fullName": 'Liam Zety',
            "imgUrl": 'https://via.placeholder.com/100',
        }],
        "groups": [{
            "id": _makeid(),
            "name": 'group 1',
            "createdAt": 'date',
            "color": '#22f24',
            "lastUpdated": 198465168486,
            "isTagsShown": false,
            "tags": [],
            "columns": [{
                "type": 'date',
                "name": 'due date'
            }],
            "tasks": [{
                "id": _makeid(),
                "name": 'sneeze',
                "createdAt": 1123124124241,
                "members": [],
                "status": 'Stuck',
                "priority": 'Low',
                "dueDate": 1123124124241,
                "updates": [],
                "lastUpdated": 'yesterday',
                "isSelected": false,
                "posts": [],
                "tags": [{ "txt": "uilorem2@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@" }, { "txt": "ux" }]
            }, {
                "id": _makeid(),
                "name": 'sneeze',
                "createdAt": 1123124124241,
                "members": [],
                "status": 'Working on it',
                "priority": 'Low',
                "dueDate": 1123124124241,
                "updates": [],
                "lastUpdated": 'yesterday',
                "isSelected": false,
                "posts": [],
                "tags": [{ "txt": "uilorem2@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@" }, { "txt": "ux" }]
            }]
        }],
        "activityLog": [{
            "id": _makeid(),
            "createdAt": 124124125124,
            "byUser": {
                "imgUrl": 'www.imgur',
                "fullName": 'shucks mcgee'
            },
            "description": 'removed task "do the dishes"',
            "task": {
                "id": _makeid(),
                "name": 'do the dishes'
            }
        },
        {
            "createdAt": 12412541251,
            "byUser": {
                "imgUrl": 'www.imgur',
                "fullName": 'shucks mcgee'
            },
            "description": 'changed group name from project2 to project3',
            "group": {
                "id": _makeid(),
                "name": 'project3'
            }
        },
        {
            "createdAt": 4514512352135,
            "byUser": {
                "imgUrl": 'www.imgur',
                "fullName": 'shucks mcgee'
            },
            "description": 'added group project2',
            "group": {
                "id": _makeid(),
                "name": 'project2'
            }
        }
        ]
    }
    const newBoard = await httpService.post(`board`, board);
    return newBoard;
}

function addGroup(board) {
    const group = {
        "id": _makeid(),
        "name": 'week1',
        "createdAt": 'date',
        "color": '#70ADB5',
        "lastUpdated": 198465168486,
        "isTagsShown": false,
        "tags": [],
        "columns": [{
            "type": 'date',
            "name": 'due date'
        }],
        "tasks": [{
            "id": _makeid(),
            "name": 'sneeze',
            "createdAt": 1123124124241,
            "members": [],
            "status": 'Working on it',
            "priority": 'Low',
            "dueDate": 214124124125,
            "updates": [
                {
                    "txt": 'dont forget about this',
                    "member": 'Roei Arazi'
                },
                {
                    "txt": 'https://res.cloudinary.com/dtg7n0zye/image/upload/v1600008729/i70mbqxvm0qh1yeznsnf.jpg',
                    "member": 'Liam Zety'
                }
            ],
            "lastUpdated": 'yesterday',
            "isSelected": false,
            "posts": [],
            "tags": ['uilorem2@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@', 'ux']
        }]
    }
    try {
        board.groups.push(group)
        updateBoard(board)
        return board
    } catch (err) {
        console.log('boardService: Couldn\'t add group');
        throw err;
    }
}

function removeGroup(groupId, board) {
    board.groups = board.groups.filter(group => group.id !== groupId)
    updateBoard(board)
    return board
}

function updateGroup(updatedGroup, board) {
    board.groups = board.groups.map(group => group.id === updatedGroup.id ? updatedGroup : group)
    updateBoard(board)
    return board
}

async function removeTask(taskId, board) {
    board.groups = board.groups.map(group => {
        group.tasks = group.tasks.filter(task => task.id !== taskId)
        return group;
    })
    updateBoard(board)
    return board;

}

async function addTask(groupId, taskName = 'Change Task Name', board) {
    const task = {
        id: _makeid(),
        name: taskName,
        createdAt: 1123124124241,
        members: [],
        status: 'Done',
        priority: 'Low',
        dueDate: Date.now(),
        updates: [],
        lastUpdated: Date.now(),
        isSelected: false,
        posts: [],
        tags: ['uilorem2@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@', 'ux']
    }
    board.groups.map(group => {
        if (group.id === groupId) group.tasks.push(task)
        return group;
    })
    updateBoard(board)
    return board;
}

function updateTask(updatedTask, board) {
    console.log('hello from board service', updatedTask, "board", board)
    board.groups = board.groups.map(group => {
        group.tasks = group.tasks.map(task => task.id === updatedTask.id ? updatedTask : task)
        return group;
    })
    updateBoard(board)
    return board
}

function _makeid(length = 7) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}