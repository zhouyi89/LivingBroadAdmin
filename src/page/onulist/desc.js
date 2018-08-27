//'use strict';

import React from 'react'
//antd
import Notification from 'antd/lib/notification'
import Button from 'antd/lib/button'
import Form from 'antd/lib/form'
import Modal from 'antd/lib/modal'
import Icon from 'antd/lib/icon'
import Input from 'antd/lib/input'
import {netdata} from './../../helper'
//import _ from 'underscore'
const FormItem = Form.Item;

const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    };
class NormalLoginForm extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        values = Object.assign({}, this.props.data, values)
        this.props.onsave(values)
      }
    });
  }
  //{"name":"ererere","pid":36,"sn":"1212","phone":"121","addr":"121","desc":"","remark":"1212121","opt":"adduser"}
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Modal
        visible={true}
          title="登记信息"
          onCancel={this.props.handleCancel}
          footer={[
            <Button key="back" size="default" onClick={this.props.handleCancel}>取消</Button>,
            <Button key="submit" type="primary" size="default" onClick={this.handleSubmit}>
              确认
            </Button>,
          ]}
          >
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem label="名称" {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue:this.props.data['name'],
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="名称" />
          )}
        </FormItem>
        <FormItem label="序列号" {...formItemLayout}>
          {getFieldDecorator('sn', {
             initialValue:this.props.data['sn'],
            rules: [{ required: true, message: 'sn!' }],
          })(
            <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} placeholder="sn" />
          )}
        </FormItem>
        <FormItem label="电话" {...formItemLayout}>
          {getFieldDecorator('phone', {
             initialValue:this.props.data['phone'],
            rules: [{ required: true, message: 'phone!' }],
          })(
            <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} placeholder="sn" />
          )}
        </FormItem>
        <FormItem label="地址" {...formItemLayout}>
          {getFieldDecorator('addr', {
             initialValue:this.props.data['addr'],
            rules: [{ required: true, message: 'addr!' }],
          })(
            <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} placeholder="sn" />
          )}
        </FormItem>
        <FormItem label="备注" {...formItemLayout}>
          {getFieldDecorator('remark', {
             initialValue:this.props.data['remark'],
            rules: [{ required: true, message: 'remark!' }],
          })(
            <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} placeholder="remark" />
          )}
        </FormItem>
      </Form>
      </Modal>
    );
  }
}

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);
export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      rowSelection: {},
      data: {},
      d: {"name":"","pid":36,"sn":this.props.v[0],"phone":"","addr":"","desc":"","remark":"","opt":"adduser"}
    }
  }
  componentDidMount () {
    this.update();
  }
  update() {
    this.setState({loading: true})
    let rd = {"sn":this.props.v[0],"opt":"quser"}
    let r = {
      method: "POST",
      body: JSON.stringify(rd)
    }
    netdata('/rest/regionopt.epy', r).then(this.ondata.bind(this))
  }
  ondata(res) {
    let sd = {loading: false}
    if (res.s === false) {
      console.log(res.d)
      Notification['error']({
        message: '数据请求错误',
        description: JSON.stringify(res.d),
      });
      this.setState(sd)
      return;
    }
    res = res.d;
    if (res.s !== 0) {
      sd.data = res;
      this.setState(sd)
      return;
    }
    this.syncuserdata(sd, res.d)
  }
  syncuserdata(sd, d) {
    if (d.sn === this.props.v[0]) {
      let xd = {"name":"","pid":36,"sn":"","phone":"","addr":"","desc":"","remark":"","opt":"adduser"}
      xd = Object.assign({}, xd, d);
      xd["sn"] = this.props.v[0]
      sd.d = xd
      sd.data = d
    }
    this.setState(sd)
  }
  save(data) {
    this.setState({loading: true})
    let r = {
      method: "POST",
      body: JSON.stringify(data)
    }
    netdata('/rest/regionopt.epy', r).then(this.ondata.bind(this))
  }
  onsave(res) {
    let sd = {loading: false}
    if (res.s === false) {
      console.log(res.d)
      Notification['error']({
        message: '数据请求错误',
        description: JSON.stringify(res.d),
      });
      this.setState(sd)
      return;
    }
    res = res.d;
    if (res.s !== 0) {
      sd.data = res;
      this.setState(sd)
      return;
    }
    this.syncuserdata(sd, res.d)
  }
  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }
  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  renderForm() {
    if (this.state.visible) {
      return (<WrappedNormalLoginForm
        data={this.state.d}
        handleCancel={this.handleCancel}
        onsave={this.save.bind(this)} />)
    }
    return null;
  }
  render() {
    let data = JSON.stringify(this.state.data)
    return (
      <div className="ant-row">
        <Form layout={'inline'} style={{float: 'left'}}>
        <div style={{float: 'left'}}>{data}</div>
        </Form>
        <Form layout={'inline'} style={{float: 'right'}}>
          <Button.Group>
            <Button type="dashed" icon="sync" size='default'
              loading={this.state.loading} onClick={this.update.bind(this)}>更新</Button>
            <Button type="dashed" icon="edit" size='default' onClick={this.showModal}>登记</Button>
          </Button.Group>
        </Form>
        {this.renderForm()}
      </div>
    )
  }
}