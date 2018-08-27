//'use strict';

import React from 'react'
import Breadcrumb from 'antd/lib/breadcrumb'
import Icon from 'antd/lib/icon'

import { Link } from 'react-router-dom'

export default class PageHeader extends React.Component {
  render() {
    return (
      <div className="e-breadcrumb">
        <div className="e-wrapper">
          <div>
            <span style={{"float": "right"}}>当前：正式数据测试账套</span>
            <Breadcrumb>
              <Breadcrumb.Item><Link to="/about"><Icon type="home" /></Link></Breadcrumb.Item>
              {
                React.Children.map(this.props.children, (child) => {
                  return <Breadcrumb.Item>{child}</Breadcrumb.Item>
                })
              }
            </Breadcrumb>
          </div>
        </div>
      </div>
    )
  }
};
/*
const Avatar = (props) => {
  return (
    <div>
      <ProfilePic username={props.username} />
      <ProfileLink username={props.username} />
    </div>
  );
}*/