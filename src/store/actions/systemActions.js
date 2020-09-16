export function loading() {
    return dispatch => {
        dispatch({ type: 'LOADING_START' })
    }
  }
  export function doneLoading() {
    return dispatch=>{
        dispatch({ type: 'LOADING_DONE' })
    }
  }