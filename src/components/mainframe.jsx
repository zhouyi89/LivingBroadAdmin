//'use strict';

import React from 'react'
import BackTop from 'antd/lib/back-top'
//Steps,
import MainHeader from './mainheader.jsx'
import MainFooter from './mainfooter.jsx'
import QueueAnim from 'rc-queue-anim';

export default class mainFrame extends React.Component {
  constructor ( props ) {
    super( props );
    this.state = {
      ver:0
    };
  }
  update() {
    this.setState({ver:this.state.ver + 1});
  }
  render() {
    return (
      <div className="layout-home cf">
        <QueueAnim type="top"><MainHeader key="dddd"/></QueueAnim>
        { this.props.children }
        {/* <MainFooter /> */}
        <BackTop className="e-back-top"><i className="menuicon iconfont icon-rock"></i></BackTop>
      </div>
    )
  }
}
