//'use strict';

import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import { withRouter } from 'react-router'

export default withRouter(class Page404 extends React.Component {
  constructor(props) {
    super(props);
    this.r = null;
    this.state = {
      dly : 10
    };
  }
  componentDidMount () {
    this.r = null;
    this._dly = 10;
    this._handle = setTimeout(this.update, 1000);
  }
  componentWillUnmount () {
    this.r = null;
    clearTimeout(this._handle);
  }
  update = ()=> {
    this._dly--;
    if (this._dly > 0) {
      this._handle = setTimeout(this.update, 1000);
    } else {
      this.r = (<Redirect to={ {
            pathname: '/index'
          } } />)
      //this.props.history.replace('/index');
    }
    this.setState({dly : this._dly});
  }
  render() {
    const b = {}
    return (
      <div data-reactroot="" className="layout-notfound___1aE_N">
        <canvas className="canvas-sea___1wAEo"  style={b}></canvas>
        <section className="notfound___18VZm">
          <div className="picture-404___1O8c3"></div>
          <div className="error-description___1Jd7b">
            您已经迷失在海洋里，系统正在派救兵来解救!
            <div className="error-time___2QZL4">还有 <span>{this.state.dly}</span> 秒钟，
              <Link to="/index">重返大陆</Link>...
              {this.r}
            </div>
          </div>
        </section>
      </div>
    )
  }
})
