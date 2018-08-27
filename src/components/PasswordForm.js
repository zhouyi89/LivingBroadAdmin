import React from 'react'
import { Form, Select, Input, Button,message } from 'antd';
import { netdata } from './../helper'
const FormItem = Form.Item;
const Option = Select.Option;

class PasswordForm extends React.Component {
  handleSubmit = (e) => {
      let that =this;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let r = {
            method: "POST",
            body: JSON.stringify({ "opt": "mfyPass","id":parseInt(localStorage.UserID) ,"OldPass":values.oldPass,"NewPass":values.newPass })
          }
          netdata('/RoleOpt.epy', r).then(
            that.ondata.bind(that)
          )
      }
    });
  }
  ondata(res) {
     if (res.d.errCode == 0) {
        message.success('密码修改成功！');
        this.props.closeModal();
    }else{
        message.error('密码修改失败！');
    }
  }
  checkPassword(rule, value, callback) {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('newPass')) {
        callback('两次密码输入不一致！');
    } else {
        callback();
    }
    }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit.bind(this)}>
        <FormItem
          label="原密码"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 16 }}
        >
          {getFieldDecorator('oldPass', {
            rules: [{ required: true,whitespace:true, message: '请输入旧密码！' },{whitespace:true,message:'不能含有空格' }],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          label="新密码"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 16 }}
        >
          {getFieldDecorator('newPass', {
            rules: [{ required: true, message: '请输入新密码！' },{whitespace:true,message:'不能含有空格' }],
          })(
            <Input type="password"/>
          )}
        </FormItem>
        <FormItem
          label="确认新密码"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 16 }}
        >
          {getFieldDecorator('checkPass', {
            rules: [{ required: true, message: '请再次输入新密码！' },{whitespace:true,message:'不能含有空格' }, {
                                    validator: this.checkPassword.bind(this)
                                }],
          })(
            <Input type="password"/>
          )}
        </FormItem>
        <FormItem
          wrapperCol={{ span: 24, offset: 18 }}
        >
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </FormItem>
      </Form>
    );
  }
}

export default PasswordForm