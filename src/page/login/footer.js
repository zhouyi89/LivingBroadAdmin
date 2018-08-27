//'use strict';

import React from 'react'
import Tooltip from 'antd/lib/tooltip'

export default class LoginFooter extends React.Component {
  render() {
    return (
      <div className="login-footer___1ktxG">
        <div className="login-about___13Aau">
          <div className="login-about-link___1psyB">
            <Tooltip placement="top" title={'youkebing@163.com'} mouseEnterDelay={0.2} mouseLeaveDelay={0}>
            <span className="tag___3kdO2">客服邮箱</span>
            </Tooltip>
            <Tooltip placement="top" title={'15861597987'} mouseEnterDelay={0.2} mouseLeaveDelay={0}>
            <span className="point___1JaSo"></span>
            <span className="tag___3kdO2">联系电话</span>
            </Tooltip>
            <span className="point___1JaSo"></span>
            <Tooltip placement="top" title={'无锡路通视信网络股份有限公司'} mouseEnterDelay={0.2} mouseLeaveDelay={0}>
            <span className="tag___3kdO2">技术支持</span>
            </Tooltip>
            <span className="point___1JaSo"  style={{display:'none'}}></span>
            <Tooltip placement="top" title={'youkebing@163.com'} mouseEnterDelay={0.2} mouseLeaveDelay={0}>
            <a href="../admin" target="_blank" style={{display:'none'}} >
              <span className="tag___3kdO2">后台登录</span>
            </a>
            </Tooltip>
          </div>
          <div className="login-copyright">Copyright (C) 2003-2018 无锡路通视信网络股份有限公司</div>
        </div>
      </div>
    )
  }
}