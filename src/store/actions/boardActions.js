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
            boardService.updateBoard(boardToSave);
            dispatch({ type: 'SET_BOARD', board: boardToSave })
        } catch (err) {
            console.log('boardActions: Couldn\'t update board');
            throw err;
        }
    }
}

export function removeBoard(boardId) {
    return async dispatch => {
        try {
            await boardService.removeBoard(boardId);
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
            const board= await boardService.addBoard();
            dispatch({ type: 'ADD_BOARD', board })
        } catch (err) {
            console.log('boardActions: Couldn\'t add board');
            throw err;
        }
    }
}
//------------------GROUP CRUD-----------------

export function removeGroup(groupId, board) {
    return dispatch => {
        try {
            const updatedBoard = boardService.removeGroup(groupId, board)
            dispatch({ type: 'SET_BOARD', board: updatedBoard });
        } catch (err) {
            console.log('boardActions: Couldn\'t remove group');
            throw err;
        }
    }
}


export function addGroup(boardId, board) {
    return dispatch => {
        try {
            const updatedBoard = boardService.addGroup(boardId, board);
            dispatch({ type: 'SET_BOARD', board: updatedBoard })
        } catch (err) {
            console.log('boardActions: Couldn\'t add group');
            throw err;
        }
    }
}
export function editGroup(group, board) {
    return dispatch => {
        try {
            const updatedBoard = boardService.updateGroup(group, board)
            dispatch({ type: 'SET_BOARD', board: updatedBoard })
        } catch (err) {
            console.log('boardActions: Coulnd\'t edit group');
            throw err;
        }
    }
    //TODO: save changes made to the group
}
//-----------------TASKS CRUD------------------------

export function addTask(groupId, taskName, board) {
    return dispatch => {
        try {
            const updatedBoard = boardService.addTask(groupId, taskName, board);
            dispatch({ type: 'SET_BOARD', board: updatedBoard })
        } catch (err) {
            console.log('boardActions: Coulnd\'t add task');
            throw err;
        }
    }
}

export function removeTask(taskId, board) {
    return dispatch => {
        try {
            const updatedBoard = boardService.removeTask(taskId, board);
            dispatch({ type: 'SET_BOARD', board: updatedBoard })
        } catch (err) {
            console.log('boardActions: Coulnd\'t add task');
            throw err;
        }
    }
}

export function editTask(task, board) {
    return dispatch => {
        try {
            const updatedBoard = boardService.updateTask(task, board);
            dispatch({ type: 'EDIT_TASK', board: updatedBoard })
        } catch (err) {
            console.log('boardActions: Coulnd\'t edit task');
            throw err;
        }
    }
}

//-----------------FILTER ACTIONS------------------------

export function setFilter(filter) {
    return dispatch => {
        dispatch({ type: 'SET_FILTER', filter })
    }
}

export function clearFilter() {
    return dispatch => {
        dispatch({ type: 'SET_FILTER', filter: {} })
    }
}
//---------------------BOARD BAR--------------------


export function toggleBoardbar() {
    return dispatch => {
        dispatch({ type: 'TOGGLE_BOARDBAR' })
    }
}