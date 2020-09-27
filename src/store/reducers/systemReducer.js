const initialState = {
  isLoading: false,
  isSnackbarShown: false,
  snackbarTxt: ''
}
export function systemReducer(state = initialState, action = {}) {
  switch (action.type) {
    case 'LOADING_START':
      return { ...state, isLoading: true };
    case 'LOADING_DONE':
      return { ...state, isLoading: false };
    case 'SHOW_SNACKBAR':
      return {
        ...state,
        isSnackbarShown: true,
        snackbarTxt: action.msg
      }
    case 'HIDE_SNACKBAR':
      return {
        ...state,
        isSnackbarShown: false,
        snackbarTxt: ''
      }
    default: return state;
  }
}