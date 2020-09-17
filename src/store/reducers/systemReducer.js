const initialState = {
  isLoading: false,
  modal: {
    isOpen: false,
  }
}

export function systemReducer(state = initialState, action = {}) {
  switch (action.type) {
    case 'LOADING_START':
      return { ...state, isLoading: true };
    case 'LOADING_DONE':
      return { ...state, isLoading: false };
    case 'OPEN_MODAL':
      console.log('OPEN MODAL',)
      return { ...state, modal: { ...state.modal, isOpen: true } };
    case 'CLOSE_MODAL':
      return { ...state, modal: { ...state.modal, isOpen: false } };
    default: return state;
  }
}