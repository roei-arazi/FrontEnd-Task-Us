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
    updateTask,
    handleBoardChanges
}

async function loadBoards() {
    const boards = await httpService.get(`board`)
    return boards
}

async function updateBoard(boardToSave) {
    socketService.emit('updateBoard', boardToSave);
    httpService.put(`board/${boardToSave._id}`, boardToSave)
    return boardToSave
}

function removeBoard(boardId) {
    return httpService.delete(`board/${boardId}`)
}

async function addBoard(loggedUser) {
    console.log('LOGGED USER', loggedUser)
    const board = {
        boardCreator: {
            "_id": loggedUser._id,
            "fullName": loggedUser.fullName,
            "imgUrl": loggedUser.imgUrl,
        },
        "name": "board",
        "createdAt": Date.now(),
        "description": 'Enter description here',
        "members": [{
            "_id": loggedUser._id,
            "fullName": loggedUser.fullName,
            "imgUrl": loggedUser.imgUrl,
        }],
        "groups": [{
            "id": _makeid(),
            "name": 'group 1',
            "createdAt": Date.now(),
            "color": '#22f24',
            "lastUpdated": Date.now(),
            "isTagsShown": false,
            "tags": [],
            "columns": [{
                "type": 'date',
                "name": 'due date'
            }],
            "tasks": [{
                "id": _makeid(),
                "name": 'sneeze',
                "createdAt": Date.now(),
                "members": [],
                "status": 'Stuck',
                "priority": 'Low',
                "dueDate": Date.now(),
                "updates": [],
                "lastUpdated": 'yesterday',
                "isSelected": false,
                "posts": [],
                "tags": []
            }, {
                "id": _makeid(),
                "name": 'sneeze',
                "createdAt": Date.now(),
                "members": [],
                "status": 'Working on it',
                "priority": 'Low',
                "dueDate": Date.now(),
                "updates": [],
                "lastUpdated": 'yesterday',
                "isSelected": false,
                "posts": [],
                "tags": []
            }]
        }],
        "activityLog": []
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
        "lastUpdated": Date.now(),
        "isTagsShown": false,
        "tags": [],
        "columns": [{
            "type": 'date',
            "name": 'due date'
        }],
        "tasks": [{
            "id": _makeid(),
            "name": 'sneeze',
            "createdAt": Date.now(),
            "members": [],
            "status": 'Working on it',
            "priority": 'Low',
            "dueDate": Date.now(),
            "updates": [],
            "lastUpdated": 'yesterday',
            "isSelected": false,
            "posts": [],
            "tags": []
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

function addTask(groupId, taskName, board) {
    const task = {
        id: _makeid(),
        name: taskName,
        createdAt: Date.now(),
        members: [],
        status: 'Done',
        priority: 'Low',
        dueDate: Date.now(),
        updates: [],
        lastUpdated: Date.now(),
        isSelected: false,
        posts: [],
        tags: []
    }
    const newBoard = JSON.parse(JSON.stringify(board))
    newBoard.groups.forEach(group => {
        if (group.id === groupId) group.tasks.push(task);
    })
    updateBoard(newBoard)
    return newBoard;
}

function updateTask(updatedTask, board) {
    board.groups = board.groups.map(group => {
        group.tasks = group.tasks.map(task => task.id === updatedTask.id ? updatedTask : task)
        return group;
    })
    updateBoard(board)
    return board
}
function handleBoardChanges(desc, loggedUser, board) {
    const changes = {
        id: _makeid(),
        changedAt: Date.now(),
        isRead: false,
        desc,
        byUser: {
            _id: loggedUser._id,
            fullName: loggedUser.fullName,
            imgUrl: loggedUser.imgUrl
        },
    }
    const updatedBoard = { ...board, activityLog: [changes, ...board.activityLog,] }
    return updateBoard(updatedBoard)
}
function _makeid(length = 7) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}