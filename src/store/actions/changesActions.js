import { boardService } from '../../services/boardService'
import socketService from '../../services/socketService.js'
import { userService } from '../../services/userService.js'

export function groupChanges(desc, loggedUser, board) {
    return async dispatch => {
        try {
            const updatedBoard = boardService.handleBoardChanges(desc, loggedUser, board)
            dispatch({ type: 'SET_BOARD', board: updatedBoard })

            const users = await userService.loadUsers();
            const notification = {
                byUser: {
                    fullName: loggedUser.fullName,
                    imgUrl: loggedUser.imgUrl
                },
                content: `${board.name}: ${desc}`,
                createdAt: Date.now()
            }
            board.members.forEach(member => {
                if (member._id === loggedUser._id) return;
                let userToUpdate = users.find(user => user._id === member._id);
                userToUpdate.notifications.unshift(notification);
                userService.updateUser(userToUpdate);
                socketService.emit('send-notif', { memberId: member._id, notification });
            })

        } catch (err) {
            console.log('boardActions: Couldn\'t send activities/notif');
            throw err;
        }
    }
}
