let menuAction = (tp, v) => {
  return dispatch => {
    dispatch(changeHandle(tp, v));
  }
}

let changeHandle = (tp, v) => {
  return {
    type: tp,
    ver:v
  }
}
//console.log(menuAction)
export default menuAction;