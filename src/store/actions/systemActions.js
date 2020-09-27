export function loading() {
  return dispatch => {
    dispatch({ type: 'LOADING_START' })
  }
}
export function doneLoading() {
  return dispatch => {
    dispatch({ type: 'LOADING_DONE' })
  }
}
export function showSnackbar(msg) {
  return dispath => {
    dispath({ type: 'SHOW_SNACKBAR', msg })
  }
}
export function hideSnackbar() {
  return dispatch => {
    dispatch({ type: 'HIDE_SNACKBAR' })
  }
}