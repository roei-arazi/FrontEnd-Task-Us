import {boardService} from '../../services/boardService'

export function loadBoards(){
    console.log('setting boards...');
    return async dispatch =>{
        try{
        const boards = await boardService.getBoard();
        console.log('got in actions:', boards);
        dispatch({type: 'SET_BOARDS', boards})
        }catch(err){
            console.log('boardActions: Couldn\'t load boards');
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

export function addGroup(boardId){
    return async dispatch =>{
        try{
            boardService.addGroup(boardId);
            dispatch({type: 'ADD_GROUP', boardId})
        }catch(err){
            console.log('boardActions: Couldn\'t add group');
            throw err;
        }
    }
}