import { boardService } from '../../services/boardService'
import socketService from '../../services/socketService.js'

export function groupChanges(desc, loggedUser, board) {
    return async dispatch => {
        try {
            const notification = {
                byUser:{
                    fullName: loggedUser.fullName,
                    imgUrl: loggedUser.imgUrl
                },
                content: desc,
                createdAt: Date.now()
            }
            console.log('got board:', board);
            board.members.forEach(member =>{
                if(member._id === loggedUser._id) return;
                socketService.emit('send-notif',{memberId: member._id, notification} )
            })
            const updatedBoard = await boardService.handleBoardChanges(desc, loggedUser, board)
            dispatch({ type: 'SET_BOARD', board: updatedBoard })
        } catch (err) {
            console.log('boardActions: Couldn\'t add group');
            throw err;
        }
    }
}

