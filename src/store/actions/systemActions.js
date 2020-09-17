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

export function openModal() {
  return dispatch => {
    dispatch({ type: 'OPEN_MODAL' })
  }
}
export function closeModal() {
  return dispatch => {
    dispatch({ type: 'CLOSE_MODAL' })
  }
}