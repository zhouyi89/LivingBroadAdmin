//'use strict';

import {Cookies} from 'react-cookie'
const props = {}

const cookie = new Cookies();

props.checked = false

class DaLogin {
  constructor() {
    this.props = props
  }
  getchecked() {
    if (cookie.get('uid') === undefined) {
      return false;
    }
    return props.checked
  }
  setchecked(b) {
    if (props.checked === b) {
      return;
    }
    props.checked = b
    //emitter
  }
  login() {
    props.checked = true;
  }
  loginOut() {
    cookie.remove('uid', { path: '/' });
    props.checked = false;
  }
  getUid() {
    return cookie.get('uid')
  }
}
const da = new DaLogin()
export default da
/*
export default class ProviderLogin extends Component {
  getChildContext() {
    return { dalogin: this.dalogin }
  }

  constructor(props, context) {
    super(props, context)
    this.dalogin = props.dalogin
  }

  render() {
    return Children.only(this.props.children)
  }
}
*/