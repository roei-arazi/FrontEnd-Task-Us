const initialState={
    boards:[]
}

export function boardReducer(state=initialState, action){
    switch (action.type) {
        case 'SET_BOARD':
            return {
                ...state,
                board: action.board
            }
        case 'ADD_GROUP':
            const boards = [...state.boards]
            const boardIdx = boards.find(board => board._id === action.boardId);
            boards[boardIdx].groups.push({
                _id: 124,
                name: 'week1',
                createdAt: 'date',
                color: 'blue',
                lastUpdated: 198465168486,
                isTagsShown: false,
                tags: [],
                columns: [{
                    type: 'date',
                    name: 'due date'
                }],
                tasks: [{
                    id: 21412,
                    name: 'sneeze',
                    createdAt: 1123124124241,
                    members: [{
                        _id: 1234,
                        name: 'osher',
                        imgUrl: 'www/sfasf'
                    }],
                    status: 'done/progress/stuck',
                    priority: 1,
                    dueDate: 214124124125,
                    note: 'dont forget about this',
                    lastUpdated: 'yesterday',
                    isSelected: false,
                    posts: [],
                    tags: ['ui', 'ux'],
                    attachedImgs: []
                }]
            })
            return{
                ...state,
                boards
            }
        default:
            return state
    }
}