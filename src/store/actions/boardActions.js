import { boardService } from '../../services/boardService'

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

// export function updateBoard(boardToSave){
//     return async dispatch =>{
//         try{
//         await boardService.updateBoard(boardToSave);
//         dispatch({type: 'SET_BOARD', board: boardToSave})
//         }catch(err){
//             console.log('boardActions: Couldn\'t update board');
//             throw err;
//         }
//     }
// }

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
//-----------------TASKS CRUD------------------------

export function addTask(groupId) {
    return async dispatch => {
        try {
            boardService.addTask(groupId);
            dispatch({ type: 'ADD_TASK', groupId })
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
    console.log('got from action::', task)
    // return async dispatch => {
    //     try {
    //         boardService.removeTask(taskId);
    //         dispatch({ type: 'REMOVE_TASK', taskId })
    //     } catch (err) {
    //         console.log('boardActions: Coulnd\'t add task');
    //         throw err;
    //     }
    // }
}