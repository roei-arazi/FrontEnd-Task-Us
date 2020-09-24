const initialState = {
    boards: [],
    filterBy: {},
    isBoardbarShown: true
}

export function boardReducer(state = initialState, action) {
    switch (action.type) {
        case 'SET_BOARDS':
            return {
                ...state,
                boards: action.boards
            }
        case 'SET_BOARD': 
            return {
                ...state,
                boards: state.boards.map(board => board._id === action.board._id ? action.board : board)
            }
        case 'REMOVE_BOARD':
            return {
                ...state,
                boards: state.boards.filter(board => board._id !== action.boardId)
            }
        case 'ADD_BOARD':
            return {
                ...state,
                boards: [...state.boards, action.board]
            }
        case 'SET_FILTER':
            return {
                ...state,
                filterBy: action.filter
            }
        case 'TOGGLE_BOARDBAR':
            return {
                ...state,
                isBoardbarShown: !state.isBoardbarShown
            }
        default:
            return state
    }
}