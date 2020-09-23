import { boardService } from '../../services/boardService'


export function groupChanges(desc, loggedUser, board) {
    console.log('im here',)
    return async dispatch => {
        try {
            const updatedBoard = await boardService.handleBoardChanges(desc, loggedUser, board)
            dispatch({ type: 'SET_BOARD', board: updatedBoard })
        } catch (err) {
            console.log('boardActions: Couldn\'t add group');
            throw err;
        }
    }
}

