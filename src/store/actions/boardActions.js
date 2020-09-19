import { boardService } from '../../services/boardService'


//------------------BOARD CRUD-----------------
export function loadBoards() {
    return async dispatch => {
        try {
            const boards = await boardService.loadBoards();
            dispatch({ type: 'SET_BOARDS', boards })
        } catch (err) {
            console.log('boardActions: Couldn\'t load boards');
            throw err;
        }
    }
}

export function updateBoard(boardToSave) {
    return async dispatch => {
        try {
            const boards = await boardService.updateBoard(boardToSave);
            dispatch({ type: 'SET_BOARD', boards })
        } catch (err) {
            console.log('boardActions: Couldn\'t update board');
            throw err;
        }
    }
}

export function removeBoard(boardId) {
    return async dispatch => {
        try {
            boardService.removeBoard(boardId);
            dispatch({ type: 'REMOVE_BOARD', boardId })
        } catch (err) {
            console.log('boardActions: Couldn\'t remove board');
            throw err;
        }
    }
}

export function addBoard() {
    return async dispatch => {
        try {
            boardService.addBoard();
            dispatch({ type: 'ADD_BOARD' })
        } catch (err) {
            console.log('boardActions: Couldn\'t add board');
            throw err;
        }
    }
}
//------------------GROUP CRUD-----------------

export function removeGroup(groupId) {
    return async dispatch => {
        try {
            dispatch({ type: 'REMOVE_GROUP', groupId });
            boardService.removeGroup(groupId)
        } catch (err) {
            console.log('boardActions: Couldn\'t remove group');
            throw err;
        }
    }
}


export function addGroup(boardId) {
    return async dispatch => {
        try {
            boardService.addGroup(boardId);
            dispatch({ type: 'ADD_GROUP', boardId })
        } catch (err) {
            console.log('boardActions: Couldn\'t add group');
            throw err;
        }
    }
}
export function editGroup(group) {
    return async dispatch => {
        try {
            dispatch({ type: 'EDIT_GROUP', group })
            // boardService.editGroup(group)
        } catch (err) {
            console.log('boardActions: Coulnd\'t edit group');
            throw err;
        }
    }
    //TODO: save changes made to the group
}
//-----------------TASKS CRUD------------------------

export function addTask(groupId, taskName) {
    return async dispatch => {
        try {
            boardService.addTask(groupId, taskName);
            dispatch({ type: 'ADD_TASK', groupId, taskName })
        } catch (err) {
            console.log('boardActions: Coulnd\'t add task');
            throw err;
        }
    }
}

export function removeTask(taskId) {
    return async dispatch => {
        try {
            boardService.removeTask(taskId);
            dispatch({ type: 'REMOVE_TASK', taskId })
        } catch (err) {
            console.log('boardActions: Coulnd\'t add task');
            throw err;
        }
    }
}

export function editTask(task) {
    return async dispatch => {
        try {
            // boardService.editTask(task);
            dispatch({ type: 'EDIT_TASK', task })
        } catch (err) {
            console.log('boardActions: Coulnd\'t edit task');
            throw err;
        }
    }
}