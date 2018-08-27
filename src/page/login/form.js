//'use strict';

import React from 'react'
//antd
import Icon from 'antd/lib/icon'
import Spin from 'antd/lib/spin'
import Input from 'antd/lib/input'
import Form from 'antd/lib/form'
import Button from 'antd/lib/button'
import Row from 'antd/lib/row'
import Col from 'antd/lib/col'
import message from 'antd/lib/message'
import notification from 'antd/lib/notification'
import { netdata } from './../../helper'
import { withRouter } from 'react-router'
//import { Link } from 'react-router'
import dalogin from '../../data/dalogin'
//import cookie from 'react-cookie'
import update from 'immutability-helper'
import $ from "jquery"
import md5 from "md5"

import cfg from '../../cfg.js'

const FormItem = Form.Item
const url = cfg.imgs.login_verify
const loadingsrc = cfg.imgs.loading
const banksrc = cfg.imgs.login_errimg

const LoginForm = Form.create()(withRouter(class LoginForm extends React.Component {
  constructor ( props ) {
    super( props )
    this.state = {
      imgsrc:loadingsrc,
      loading:false
    }
    this.cnt = 0
  }
  changestate = (k, v) => {
    if (this.state[k] === v) {
      return;
    }
    let oo = {}
    oo[k] = {'$set': v}
    let o = update(this.state, oo)
    this.setState(o)
  }
  cbgetverifyimg = (data, textStatus) => {
    if(data["IsAuth"]==0){
      notification["warning"]({
        message: '警告',
        description: '当前版本为试用版本，可试用一个小时。如需激活请将本机序列号'+data["Serial"]+"   发送给管理员获取激活文件。",
        duration: 100,
      });
    }
    let src = data['src']
    this.verfyimagesrc = src
    this.changestate('imgsrc', src)
  }
  getverifyimg = () => {
    this.changestate('imgsrc', loadingsrc)
    let d = { "opt": "new" };
    let d2 = JSON.stringify(d);//onLoad onError
    $.post(url, d2, this.cbgetverifyimg, "json").catch(this.onErrimg);
  }
  onErrimg = () => {    
    this.changestate('imgsrc', banksrc)
  }

  cbloginsys = (data: any, textStatus: string) => {
    this.changestate('loading', false)
    dalogin.setchecked(true);
    // return;
    try {
      if (data["s"] === 0) {
        dalogin.setchecked(true)
        //AppData.SetKV('power', true);
        if(data['User'].Name==="admin"){
          localStorage.UserName ="超级管理员";
        }
        else{
          localStorage.UserName =data['User'].Name;
        }  
        localStorage.logmenuKey="1";
        localStorage.UserID =data['User'].id;  
        localStorage.Auth =data['User'].Power;  
        localStorage.options =JSON.stringify(data['Map']);  
        localStorage.videoleft =120;  
        localStorage.videotop =120;  
        localStorage.videoheight =250;  
        localStorage.videowidth =420;  
      this.props.history.replace('/index');

        return;
      } else {
        if (data["m"]) {
          message.warning(data["m"]);
          return;
        }
      }
    }
    catch(err) {
    }
    message.error('验证失败!!');
  }
  loginsys = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      //console.log('Received values of form: ', values);
      if (!err) {
        return
        //console.log('Received values of form: ', values);
      }
    });
    let d = { "opt": "login" }
    let gv1 = this.props.form.getFieldValue
    let gv = (p) => {
      let a = gv1(p)
      if (a) {
        return a
      }
      return ""
    }
    d["u"] = gv('u');
    d["v"] = gv('v');
    d["k"] = this.verfyimagesrc;
    d["p"] = md5(gv('p') + "__" + d["k"]);
    let d2 = JSON.stringify(d)
    //this.msgtip.html("正在验证登录信息，请稍候....");
    this.changestate('loading', true)
    $.post(url, d2, this.cbloginsys, "json").catch(this.cbloginsys);
  }

  componentDidMount () {
    this.getverifyimg()
  }
  componentWillUnmount () {
  }
  render() {
    this.cnt = this.cnt + 1;
    const { getFieldDecorator } = this.props.form;
    return (
      <Spin spinning={this.state.loading} className="">
      <Form layout={'vertical'} autoComplete="false" onSubmit={this.loginsys}>
        {/*disable complted*/}
        <div style={{"display": "none"}}>
          <input type="text" autoComplete="new-password" />
          <input type="password" autoComplete="new-password" />
        </div>
        <FormItem>
        {getFieldDecorator('u', {
            rules: [{ required: true, message: '请输入用户名!' }],
          })(
          <Input id="usercode121" type="text" name='usercode211'  autoComplete="false" placeholder="用户名"
            prefix={<Icon type="user" />} size='large' />
          )}
        </FormItem>
        <FormItem>
        {getFieldDecorator('p', {
          })(
          <Input type='password' name="password"  placeholder="密码"
            prefix={<Icon type="lock" />} size='large' />
          )}
        </FormItem>
        <FormItem>            {getFieldDecorator('v', {
            rules: [{ required: true, message: '请输入验证码!' }]
          })(
          <Row type="flex" justify="space-around" align="space-between">
            <Col className="gutter-row" span={12}>
              <Input id="usercode11" name='usercode11' autoComplete="off" placeholder="验证码" size='large' />
            </Col>
            <Col span={8}>
              <span className="pass-verifyCodeImgParent">
                <img alt="验证码" className="pass-verifyCode" role="presentation" src={this.state.imgsrc}
                  onDoubleClick={this.getverifyimg} />
              </span>
            </Col>
            <Col span={4}>
              <div className="pass-change-verifyCode">
              <a id="TANGRAM__PSP_4__verifyCodeChange" onClick={this.getverifyimg}>换一张</a>
              </div>
            </Col>
          </Row>)}
        </FormItem>
        <FormItem><Button id="subbtn" className='login-submit' htmlType="submit">登 录</Button></FormItem>
      </Form>
      <style>{
        `
         input#u, input#usercode11, input#p{
          color: #ffffff;
          font-size: 14px;
          border: 1px solid rgba(255, 255, 255, 0.5);
          background: rgba(255, 255, 255, 0.2);
          }
          #subbtn:hover{
            opacity: 0.7;
            background-color: #86ce2f;
             color: #FFF;
          }  


        `
      }
         

      </style>
      </Spin>
    )
  }
}))

export default LoginForm