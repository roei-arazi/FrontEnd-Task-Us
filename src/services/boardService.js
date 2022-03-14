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
    const boards = await httpService.get('board')
    return boards
}
async function removeBoard(boardId) {
    return await httpService.delete(`board/${boardId}`)
}
async function addBoard(loggedUser) {
    const board = {
        boardCreator: {
            "_id": loggedUser._id,
            "fullName": loggedUser.fullName,
            "imgUrl": loggedUser.imgUrl,
        },
        "name": "Board",
        "createdAt": Date.now(),
        "desc": 'Enter description here',
        "members": [{
            "_id": loggedUser._id,
            "fullName": loggedUser.fullName,
            "imgUrl": loggedUser.imgUrl,
        }],
        "groups": [{
            "id": _makeid(),
            "name": 'group 1',
            "createdAt": Date.now(),
            "color": '#1a1c20',
            "lastUpdated": Date.now(),
            "isTagsShown": false,
            "tags": [],
            "tasks": [{
                "id": _makeid(),
                "name": 'Click me!',
                "createdAt": Date.now(),
                "members": [],
                "status": '',
                "priority": '',
                "dueDate": Date.now(),
                "updates": [],
                "lastUpdated": 'yesterday',
                "isSelected": false,
                "posts": [],
                "tags": []
            }, {
                "id": _makeid(),
                "name": 'Rename here!',
                "createdAt": Date.now(),
                "members": [],
                "status": '',
                "priority": '',
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
async function addGroup(board, loggedUser) {
    const group = {
        "id": _makeid(),
        "name": 'week1',
        "createdAt": 'date',
        "color": '#70ADB5',
        "lastUpdated": Date.now(),
        "isTagsShown": false,
        "tags": [],
        "tasks": [{
            "id": _makeid(),
            "name": 'Click here!',
            "createdAt": Date.now(),
            "members": [],
            "status": '',
            "priority": '',
            "dueDate": Date.now(),
            "updates": [],
            "lastUpdated": 'yesterday',
            "isSelected": false,
            "posts": [],
            "tags": []
        }]
    }
    try {
        const updateBoard = {...board, groups:[group, ...board.groups]}
        const desc = `${loggedUser.fullName} Added a new group.`
        return await handleBoardChanges(desc, loggedUser, updateBoard)
    } catch (err) {
        console.log('boardService: Couldn\'t add group');
        throw err;
    }
}
async function removeGroup(groupId, board, loggedUser) {
    let group = null;
    board.groups = board.groups.filter(currGroup => {
        const isGroup = currGroup.id === groupId;
        if (isGroup) group = currGroup;
        return !isGroup;
    })
    const desc = `${loggedUser.fullName} Removed group: ${group.name}`
    return await handleBoardChanges(desc, loggedUser, board)
}
async function updateGroup(updatedGroup, board, desc, loggedUser) {
    board.groups = board.groups.map(group => group.id === updatedGroup.id ? updatedGroup : group)
    return await handleBoardChanges(desc, loggedUser, board)
}
async function removeTask(taskId, board, group, loggedUser) {
    let task = null
    const groupIdx = board.groups.findIndex(currGroup => currGroup.id === group.id)
    board.groups[groupIdx].tasks = board.groups[groupIdx].tasks.filter(currTask => {
        const isTask = currTask.id === taskId
        if (isTask) task = currTask;
        return !isTask;
    })
    if (board.groups[groupIdx].tasks.length === 0) {
        board.groups.splice(groupIdx, 1)
    }
    const desc = `${loggedUser.fullName} Removed task: ${task.name} from group ${group.name}`;
    return await handleBoardChanges(desc, loggedUser, board)
}
async function addTask(groupId, taskName, board, loggedUser) {
    const task = {
        id: _makeid(),
        name: taskName,
        createdAt: Date.now(),
        members: [],
        status: '',
        priority: '',
        dueDate: Date.now(),
        updates: [],
        lastUpdated: Date.now(),
        isSelected: false,
        posts: [],
        tags: []
    }
    const groupIdx = board.groups.findIndex(group => group.id === groupId)
    const desc = `${loggedUser.fullName} Added a new task: ${taskName} to group ${board.groups[groupIdx].name}`
    board.groups[groupIdx].tasks.push(task)
    return await handleBoardChanges(desc, loggedUser, board)
}
async function updateTask(updatedTask, board, desc, loggedUser) {
    board.groups = board.groups.map(group => {
        group.tasks = group.tasks.map(task => task.id === updatedTask.id ? updatedTask : task)
        return group;
    })
    return await handleBoardChanges(desc, loggedUser, board)
}
async function handleBoardChanges(desc, loggedUser, board) {
    if (!desc) return await updateBoard(board)
    const changes = {
        id: _makeid(),
        changedAt: Date.now(),
        desc,
        byUser: {
            _id: loggedUser._id,
            fullName: loggedUser.fullName,
            imgUrl: loggedUser.imgUrl
        },
    }
    const updatedBoard = { ...board, activityLog: [changes, ...board.activityLog] }
    return await updateBoard(updatedBoard)
}
async function updateBoard(boardToSave) {
    socketService.emit('updateBoard', boardToSave);
    await httpService.put(`board/${boardToSave._id}`, boardToSave)
    return boardToSave
}
function _makeid(length = 7) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}