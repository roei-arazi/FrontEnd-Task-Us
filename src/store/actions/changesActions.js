export function groupChanges(changedAt, board, originalValue, changedValue, loggedUser) {

    const changes = {
        id: _makeid(),
        changedAt,
        boardName: board.name,
        byUser: {
            _id: loggedUser._id,
            fullName: loggedUser.fullName,
            imgUrl: loggedUser.imgUrl
        },
        originalValue,
        changedValue
    }

    console.log('BOARD:', board)
    console.log(changes.changedAt, 'On board:', changes.boardName, changes.byUser.fullName, 'changed group name from', changes.originalValue, 'to', changes.changedValue)
    const updatedBoard = { ...board, activityLog: [...board.activityLog, changes] }
    console.log('UPDATED BOARD:', updatedBoard)
    return dispatch => {
        try {
            dispatch({ type: 'SET_BOARD', board: updatedBoard })
        } catch (err) {
            console.log('boardActions: Couldn\'t add group');
            throw err;
        }
    }
}

function _makeid(length = 7) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}