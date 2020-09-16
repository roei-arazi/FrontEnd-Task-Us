const initialState={
    board:{}
}

export function boardReducer(state=initialState, action){
    switch (action.type) {
        case 'SET_BOARD':
            return {
                ...state,
                board: action.board
            }
        default:
            return state
    }
}