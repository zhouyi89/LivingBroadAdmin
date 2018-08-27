const initState = {
    ver:1
}

let mainReducer = (state = initState, action) => {
  switch (action.type) {
    case "change":
      if (action.ver === state.ver)
        return state;
      return Object.assign({}, state, {ver:action.ver})
    default:
        return state;
  }
}

export default mainReducer;