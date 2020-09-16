const initialState={
    boards:[]
}

export function boardReducer(state=initialState, action){
    switch (action.type) {
        case 'SET_BOARDS':
            return {
                ...state,
                boards: action.boards
            }
        case 'ADD_GROUP':
            return{
                ...state,
                boards: state.boards.map(board =>{
                    if(board._id === action.boardId) board.groups.push({
                        id: _makeid(),
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
                            id: _makeid(),
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
                    return board;
                })
            }
        case 'REMOVE_GROUP':
            return{
                ...state,
                boards: state.boards.map(board => {
                    board.groups = board.groups.filter(group => group.id !== action.groupId)
                    return board;
                })
            }
        case 'ADD_TASK':
            console.log('got group id:', action.groupId);
            return {
                ...state,
                boards: state.boards.map(board => {
                    board.groups.map(group => {
                        if(group.id === action.groupId) group.tasks.push({
                            id: _makeid(),
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
                        })
                        return group;
                    })
                    return board;
                })
            }
        case 'REMOVE_TASK':
            return {
                ...state,
                boards: state.boards.map(board =>{
                    board.groups.map(group =>{
                        group.tasks = group.tasks.filter(task => task.id !== action.taskId)
                        return group;
                    })
                    return board;
                })
            }
        case 'EDIT_TASK':
            return {
                ...state,
                boards: state.boards.map(board =>{
                    board.groups = board.groups.map(group =>{
                        group.tasks = group.tasks.map(task => task.id === action.task.id ? action.task : task);
                        return group;
                    })
                    return board;
                })
            }
        default:
            return state
    }
}

function _makeid(length = 7){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for(var i=0; i < length; i++)
    {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}