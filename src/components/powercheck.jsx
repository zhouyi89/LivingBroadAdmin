//'use strict';

import React from 'react'
import Steps from 'antd/lib/steps'

import { withRouter } from 'react-router'
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'

const Step = Steps.Step;
export default withRouter(class PowerCheck extends React.Component {
  static propTypes = {
    k: PropTypes.number,
    err: PropTypes.bool,
    status: PropTypes.string
  };
  render() {
    const { k, err, status } = this.props
    let a = err === true? 'none': ''
    let b = a? '': 'none'
    let cc = "正在获取权限信息..."
    if (k === 1) {
      cc = '正在校验权限信息...'
    } else if (k === 2) {
      cc = '权限校验成功...'
    }
    return (
      <div className="power-check">
        <div className="power-check-tip" style={{"visibility": "visible", "opacity": 1, "transform": "translateX(0px) scale(1)"}}>
          <Steps size="small" current={k} status={status}>
            <Step className={'antde-stepsbk'} title="读取权限" />
            <Step title="校验权限" />
            <Step title="校验合格" />
          </Steps>
          <div className="power-check-info" style={{display:a}}>{cc}</div>
          <div className="power-check-error" style={{display:b}}><p>未检测到使用过的用户信息！</p><p> <Link to="/login"><a>您还可以跳转登录</a></Link></p>
          </div>
        </div>
      </div>
    )
  }
})
