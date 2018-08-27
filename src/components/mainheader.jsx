//'use strict';

import React from "react";
// import Menu from 'antd/lib/menu'
// import Badge from 'antd/lib/badge'
// import Modal from 'antd/lib/modal'
// import Avatar from 'antd/lib/avatar'
import {
  Form,
  Select,
  Input,
  Button,
  Menu,
  Modal,
  Avatar,
  Badge,
  Tooltip,
  Icon,
  Tag 
} from "antd";
import QueueAnim from 'rc-queue-anim';
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import dalogin from "../data/dalogin";
import $ from "jquery";
import AppData from "./appdata.jsx";
import { connect } from "react-redux";
import PasswordForm from "./PasswordForm";
import Png from "../resource/edept-other.png";
import Noalarm from "../resource/noalarm.svg";
import { netdata } from './../helper'
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const Divider = Menu.Divider;

const PasswordFormCON = Form.create()(PasswordForm);

const uid = "uid_key_12345";
let timer;
let timerAlarm;
const mapStateToProps = state => {
  return {
    menuver: state.Menu
  };
};

const mainHeader = withRouter(
  class mainHeader extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        visible: false,
        modPasswordVis: false,
        toolvis: false,
        alarmnum:0,
        alarmlist:[]
      };
    }
    showModal() {
      this.setState({
        visible: true
      });
    }
    handleOk() {
      //console.log('Clicked OK');
      this.setState({
        visible: false
      });
    }
    handleCancel(e) {
      //console.log(e);
      this.setState({
        visible: false
      });
    }
    PassCancel() {
      this.setState({
        modPasswordVis: false
      });
    }
    handelButtonClick(event) {
      event.preventDefault();
    }
    funclick(type, e) {
      this.setState({ toolvis: false });
      switch (type) {
        case 1:
          this.setState({ visible: true });
          break;
        case 2:
          this.setState({ modPasswordVis: true });
          break;
        case 3:
          break;
      }
    }
    menuClick(e) {
      if (e.key === "about") {
        this.setState({ visible: true });
      } else if (e.key === "modify") {
        this.setState({ modPasswordVis: true });
      } else if (e.key === "exitsys") {
        dalogin.loginOut();
        //exitsys
      }
    }
    fix(num, length) {
      return ("" + num).length < length
        ? (new Array(length + 1).join("0") + num).slice(-length)
        : "" + num;
    }
    componentDidMount() {
      $(window).bind("resize", this.getWidth);
      let that = this;
      this.getWidth();
      try {
        let myDateF = new Date();
        let timeF =
          that.fix(myDateF.getHours(), 2) +
          ":" +
          that.fix(myDateF.getMinutes(), 2);
        let time1F =
          myDateF.getFullYear() +
          "-" +
          (myDateF.getMonth() + 1) +
          "-" +
          myDateF.getDate();
        document.getElementById("timeHM").innerHTML = timeF;
        document.getElementById("timeYMD").innerHTML = time1F;

        let name = localStorage.UserName;
        if (name != null) {
          let len = name.length;
          if (len > 7) {
            document.getElementById("UserName").innerHTML =
              name.substring(0, 7) + "..";
          } else {
            document.getElementById("UserName").innerHTML = name;
          }
          timer = setInterval(function() {
            let myDate = new Date();
            let time =
              that.fix(myDate.getHours(), 2) +
              ":" +
              that.fix(myDate.getMinutes(), 2);
            let time1 =
              myDate.getFullYear() +
              "-" +
              (myDate.getMonth() + 1) +
              "-" +
              myDate.getDate();
            document.getElementById("timeHM").innerHTML = time;
            document.getElementById("timeYMD").innerHTML = time1;
          }, 5000);
          that.GetAlarm();
          timerAlarm =setInterval(function() {
                that.GetAlarm();
          }, 30000);
        } else {
          //  this.props.history.replace('/power')
        }
      } catch (error) {}
    }
    GetAlarm(){
      let r = {
        method: "POST",
        body: JSON.stringify({"opt":"GetCurAlarm"})
      }
      netdata('/AlarmOpt.epy', r).then(
        this.ondata.bind(this)
      )

    }
    ondata(res) {

      if (res.d.errCode == 0) {
          let Vs = res.d.Values;
          // console.log(Vs.length)
          this.setState({alarmnum:Vs.length,alarmlist:Vs})
      }
  }
    componentWillUnmount() {
      clearInterval(timer);
      clearInterval(timerAlarm);
      $(window).unbind("resize", this.getWidth);
    }
    getBLen(str) {
      if (str == null) return 0;
      if (typeof str != "string") {
        str += "";
      }
      return str.replace(/[^\x00-\xff]/g, "01").length;
    }
    getWidth = () => {
      var pageWidth = window.innerWidth;
      if (typeof pageWidth !== "number") {
        if (document.compatMode === "number") {
          pageWidth = document.documentElement.clientWidth;
        } else {
          pageWidth = document.body.clientWidth;
        }
      }
      this.setState({ width: pageWidth });
      return pageWidth;
    };
    settoolvis() {
      this.setState({ toolvis: !this.state.toolvis });
    }
    renderTooltipTitle() {
      let that = this;
      return (
        <div>
          <div className="funIcons">
            <div style={{ margin: "auto", width: "350px" }}>
              <div>
                <div
                  title="联系方式"
                  className="funIconItem"
                  onClick={this.funclick.bind(that, 1)}
                >
                  <Icon type="mobile" />
                </div>
                <div
                  title="修改密码"
                  className="funIconItem"
                  onClick={this.funclick.bind(that, 2)}
                >
                  <Icon type="setting" />
                </div>
                <div
                  title="消息通知"
                  className="funIconItem"
                  onClick={this.funclick.bind(that, 3)}
                >
                  <span className="ant-badge">
                    <Icon type="notification" />
                  </span>
                </div>
                <div title="开发中" className="funIconItem">
                  <i
                    className="anticon anticon-retweet"
                    style={{ fontSize: "inherit" }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="sysitems">
            <div>
            <QueueAnim className="qa-content">
              <div key="a1">
              <Link to="/DisplayBoard">
                <div
                  
                  className="sysitem"
                >
                  <i className="sysitemicon icon3">&nbsp;</i>
                  <div title="综合看板" className="sysitemname">
                  综合看板
                  </div>
                </div>
              </Link>
              </div>
              <div key="a2">
              <Link to="/onlineHisMana">
                <div
                  
                  className="sysitem"
                >
                  <i className="sysitemicon icon4">&nbsp;</i>
                  <div title="历史曲线" className="sysitemname">
                  历史曲线
                  </div>
                </div>
              </Link>
              </div>
              <div key="d">
              <Link to="/NetworkMana">
                <div
    
                  className="sysitem"
                >
                  <i className="sysitemicon icon4">&nbsp;</i>
                  <div title="设备管理" className="sysitemname">
                    设备管理
                  </div>
                </div>
              </Link>
              </div>
              <div key="b">
            <Link to="/tree">
              <div
                className="sysitem"
              >
                <i className="sysitemicon icon2">&nbsp;</i>
                <div title="设备添加" className="sysitemname">
                设备添加
                </div>
              </div>
            </Link>
            </div>
            </QueueAnim>
            <QueueAnim className="qa-content" >
            
              <div key="a">
              <Link to="/BroadSet">
                <div
                  
                  className="sysitem"
                >
                  <i className="sysitemicon icon1">&nbsp;</i>
                  <div title="广播设置" className="sysitemname">
                    广播设置
                  </div>
                </div>
              </Link>
              </div>
              
            {localStorage.UserName ==="超级管理员" ?    <div key="c">
            <Link to="/AuthConfig">
              <div
                className="sysitem"
              >
                <i className="sysitemicon icon3">&nbsp;</i>
                <div title="权限管理" className="sysitemname">
                  权限管理
                </div>
              </div>
            </Link>
            </div>:null}
              </QueueAnim>
            </div>
          </div>
          <div className="systemsFooter">
            <div style={{ float: "left", color: "rgb(121, 161, 186)" }}>
              上次登入时间： 2018-07-18 17:12:15
            </div>
            <div style={{ float: "right" }}>
              <Link to="/login">
                <i title="退出" className="anticon anticon-poweroff logoutIcon" />
              </Link>
            </div>
          </div>
          
        </div>
      );
    }

    gotoAlarmhis(){
      localStorage.logmenuKey="3"
      this.props.history.replace('/SystemLog');
    }


   AlarmremoveClick(a,b) {
    let r = {
        method: "POST",
        body: JSON.stringify({"opt":"DealAlarm","DevId":a.toString(),"AlarmType":b})
      }
      netdata('/AlarmOpt.epy', r).then(
        this.ondata.bind(this)
      )
    }
    renderAlarmList(){
      let list;
      let data = this.state.alarmlist;
      if(data.length===0){
        list = (<div className="notFound-alarm"><img src={Noalarm} alt="not found" /><div>没有新的告警</div></div>)
      }else{
        list= data.map((item) => {
          let type="";
          switch (item[1]) {
        case "1":
        type ="音柱";
          break;
        case "2":
        type ="多路语音合成器";
    
          break ;
        case "3":
        type ="电话短信网关";
     
          break ;
        case "4":
        type ="数字编码控制器";

          break ;
        case "5":
        type ="播出控制器";

          break ;
        default:
          break;
         }
            return (<div  className="alarm-list-item" key={item[0]}>
                              <div className="alarm-list-item-meta">
                                    <div className="alarm-list-item-meta-content">
                                        <h4 className="alarm-list-item-meta-title">
                                          <div className="title-alarm">
                                            {item[2]}
                                            <div className="extra-alarm">
                                                {item[4]=="2"? <Tag className="red-alarm">设备离线</Tag>:<Tag className="green-alarm">设备上线</Tag>}
                                            </div>
                                          </div>
                                        </h4>
                                         <div className="alarm-list-item-meta-description">
                                         <div>
                                            <div className="desc-alarm">
                                            {type}({item[3]}) 在 {item[5]}  {item[4]=="2"?"离线":"上线"}
                                            </div>
                                            <div className="datetime-alarm">
                                            </div>
                                          </div>
                                         </div>
                                    </div>
                                   
                              </div> 
                              <div className="removeAlarm"  >
                                  <Button type="primary"  shape="circle" icon="close" onClick={this.AlarmremoveClick.bind(this,item[0],item[4])} />
                              </div>
                        </div>)

        })
      }



      return(    <div style={{width:300,height:350}}> 
                      <div className="alarmList" id="alarmList">  
                      <QueueAnim className="qa-content">
                              {list}
                      </QueueAnim>
                      </div>
                    {/* <Link to="/SystemLog"> */}
                      
                      <div onClick={this.gotoAlarmhis.bind(this)} className="alarmclear">查看告警历史</div>
                    {/* </Link> */}
                </div>)
    }
    renderAlarm(){

              return(<Tooltip
                  placement="bottomRight"
                  title={this.renderAlarmList.bind(this)}
                  trigger="click"    
                  overlayClassName="myalarm"      
               
                >
                <div
            style={{
              height: "100%",
              width: "100%",
              color: " #FFF",
              padding:"0 20px"
            }}
          >
          <Badge count={this.state.alarmnum} overflowCount={99}>
          <i style={{ fontSize: 17,     marginTop:" 4px"}} className="iconfont icon-top-menu-message"></i>
        </Badge>
          </div>
             
                </Tooltip>)

    }
    renderTitle() {
      let that = this;
      return (
        // <div style={{height:'62px'}}>
        //   <Avatar size="large" style={{ backgroundColor: '#87d068', marginTop:10 }} icon="user"
        //     src={require("./../resource\\user.png")}>
        //   </Avatar>
        // </div>
        // <Tooltip visible={this.state.toolvis} placement="bottomRight" title={this.renderTooltipTitle.bind(this)} onClick={this.settoolvis.bind(that)}>
        <Tooltip
          placement="bottomRight"
          title={this.renderTooltipTitle.bind(this)}
          trigger="click"
        >
          <div
            style={{
              height: "100%",
              width: "100%",
              color: " #FFF",
              minWidth: "60px",
              padding:"0 20px"
            }}
          >
            <span>
              <span className="ant-badge">
                <i
                  className="anticon anticon-user"
                  style={{ fontSize: "14px", marginRight: "8px" }}
                />
                <span id="UserName"> 加载中</span>
              </span>
            </span>
          </div>
        </Tooltip>
      );
      //return <span><i className="anticon anticon-user"></i>z_z</span>
    }
    subMenuClass(k, cc) {
      if (k === cc[0]) {
        return "top-menu top-menu-drop-left ant-menu-item-selected";
      }
      return "top-menu top-menu-drop-left";
    }
    render() {
      //const { Active, ...props } = this.props;
      let k = [AppData.GetV("menu")];
      let kk = AppData.GetHisUrl();
      let children = kk.map((o, i) => {
        let u = uid + o.k; //key={u}
        return (
          <Menu.Item key={u}>
            <Link to={o.url}>
              <i />
              <div>{o.n}</div>
            </Link>
          </Menu.Item>
        );
      });
      let wsty = { width: "88px" };
      return (
        <header
          className="e-header show"
          style={{ boxShadow: "0px 1px 1px rgb(47, 70, 89)" }}
        >
          <div
            className="e-wrapper"
            style={{ minwidth: "1349px", width: this.state.width }}
          >
            <div className="e-logo">
              <div className="logowrap">
                <i className="logo" />
                <span className="title">
                  {process.env.REACT_APP_WEBSITE_NAME}
                </span>
                <span className="subtitle" />
                <span className="version">
                  {process.env.REACT_APP_WEBSITE_VER}
                </span>
              </div>
            </div>
            <div className="e-nav-body">
              <nav className="e-nav" id="e-nav">
                <Menu
                  openSubMenuOnMouseEnter={false}
                  theme="light"
                  mode="horizontal"
                  selectedKeys={k}
                  style={{ lineHeight: "64px" }}
                >
                  {/* <Menu.Item key="1" className="top-menu" style={wsty}>
                <Link to="/index"><i className="menuicon iconfont icon-top-menu-position"></i><div>地图</div></Link>
              </Menu.Item> */}
                  <Menu.Item key="1" className="top-menu" style={wsty}>
                    <Link to="/">
                      <i className="menuicon iconfont icon-jianzhuqun" />
                      <div>实时广播</div>
                    </Link>
                  </Menu.Item>
                  {/* <Menu.Item key="2" className="top-menu" style={wsty}>
                <Link to="/onulist"><i className="menuicon iconfont icon-top-menu-folder"></i><div>浏览</div></Link>
              </Menu.Item> */}
                  <Menu.Item key="2" className="top-menu" style={wsty}>
                    <Link to="/TimingBroad">
                      <i className="menuicon fa fa-bell-o" style={{    marginLeft: "11px"}}/>
                      <div>定时广播</div>
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="3" className="top-menu" style={wsty}>
                    <Link to="/BroadSet">
                      <i className="menuicon fa fa-gears" style={{    marginLeft: "11px"}}/>
                      <div>广播设置</div>
                    </Link>
                  </Menu.Item>
                  {/* <Menu.Item key="3" className="top-menu" style={wsty}>
                <Link to="/flow"><i className="menuicon iconfont icon-top-menu-folder"></i><div>流程图</div></Link>
              </Menu.Item> */}
                  {/* <Menu.Item key="4" className="top-menu" style={wsty}>
                <Link to="/AuthConfig"><i className="menuicon iconfont anticon-close"></i><div>权限管理</div></Link>
              </Menu.Item> */}
                  <Menu.Item key="5" className="top-menu" style={wsty}>
                    <Link to="/SystemLog">
                      <i className="menuicon fa fa-calendar" style={{    marginLeft: "11px"}}/>
                      <div>系统日志</div>
                    </Link>
                  </Menu.Item>
                  {/* <Menu.Item key="6" className="top-menu" style={wsty}>
                    <Link to="/tree">
                      <i className="menuicon iconfont icon-top-menu-setting" />
                      <div>系统设置</div>
                    </Link>
                  </Menu.Item> */}
                  <Menu.Item key="7" className="top-menu" style={wsty}>

                   <Link to="/NetworkMana"><i className="menuicon fa fa-cubes" style={{    marginLeft: "11px"}}></i><div>网管系统</div></Link>
                {/* <Link to="/AppsMana"><i className="menuicon iconfont anticon-credit-card"></i><div>网管系统</div></Link> */}
              </Menu.Item>
              <Menu.Item key="10" className="top-menu" style={wsty}>
              <Link to="/cctv"><i className="menuicon fa fa-tv" style={{    marginLeft: "11px"}}></i><div>监控管理</div></Link>
                {/* <Link to="/AppsMana"><i className="menuicon iconfont anticon-credit-card"></i><div>网管系统</div></Link> */}
              </Menu.Item>
{/*               
              <Menu.Item key="8" className="top-menu" style={wsty}>
                <Link to="/DisplayBoard"><i className="menuicon iconfont anticon-code-o"></i><div>数据概览</div></Link>
              </Menu.Item> */}
                </Menu>
              </nav>
            </div>
            <div className="e-bar" style={{ zIndex: 2000 }} id="e-bar">
              <Menu
                openSubMenuOnMouseEnter={false}
                onClick={this.menuClick.bind(this)}
                theme="dark"
                mode="horizontal"
                selectedKeys={k}
              >

                <Menu.Item className="">
                  {/* <Link title="消息" to="/">
                  <Badge count={0} overflowCount={999}>
                    <i style={{width:"25px"}} className="iconfont icon-top-menu-message"></i>
                  </Badge>
                </Link> */}
                  <div>
                    <div style={{ position: "relative" }}>
                      <span
                        id="timeHM"
                        style={{
                          position: "absolute",
                          textAlign: "center",
                          fontFamily: "lcdFont",
                          color: "rgb(255, 255, 255)",
                          fontWeight: 500,
                          fontSize: "18px",
                          top: "-8px",
                          left: "11px"
                        }}
                      >
                        00:00
                      </span>

                      <span
                        id="timeYMD"
                        style={{
                          position: "absolute",
                          top: "10px",
                          fontSize: " 12px",
                          opacity: "0.6"
                        }}
                      >
                        0000-00-00
                      </span>
                    </div>
                  </div>
                  <div style={{ opacity: 0 }}>0000-00-00</div>
                </Menu.Item>
                {/* <Menu.Item className="">
                <Tooltip
                  placement="bottomRight"
                  title={this.renderTooltipTitle.bind(this)}
                  trigger="click"
                  overlayStyle={{paddingTop:"33px"}}
                >
                    <Badge count={this.state.alarmnum} overflowCount={999}>
                      <i style={{ fontSize: 17,     marginTop:" 4px"}} className="iconfont icon-top-menu-message"></i>
                    </Badge>
                
                </Tooltip>

              </Menu.Item> */}
              <SubMenu key="7" className="" id="1111" title={this.renderAlarm()}>
              </SubMenu>
                <SubMenu key="8" className="" title={this.renderTitle()}>
                  {/* <Menu.Item key="setting:1"><div>联系方式</div></Menu.Item>
                <Menu.Item key="modify"><div>修改密码</div></Menu.Item>
                <Menu.Item key="about"><div>关于软件</div></Menu.Item> */}
                  {/* <Divider />
                {
                  children
                }
                <Divider /> */}
                  {/* <Menu.Item key="exitsys">
                  <Link to="/login"><div>退出</div></Link>
                </Menu.Item> */}
                </SubMenu>
              </Menu>
            </div>
            <Modal
              title="应急广播管理系统 v1.1.0.20180524alpha"
              visible={this.state.visible}
              onOk={this.handleOk.bind(this)}
              onCancel={this.handleCancel.bind(this)}
              wrapClassName="vertical-center-modal"
            >
              <div>版权所有 2003-2018 无锡路通视信网络股份有限公司.保留一切权利.苏ICP备09011290号</div>
            </Modal>
            <Modal
              title="修改密码"
              visible={this.state.modPasswordVis}
              footer={null}
              onCancel={this.PassCancel.bind(this)}
            >
              <PasswordFormCON closeModal={this.PassCancel.bind(this)} />
            </Modal>
            <style>
            {`
            .ant-menu-item, .ant-menu-submenu-title{
              padding:0;
            }
            .qa-content{
              overflow: hidden;
            }
            .ant-tooltip-inner{
              max-width:500px
              }
              .ant-tooltip {
                opacity: 1;
                z-index: 999;
            }
            .ant-tooltip-inner {
                  background-color: #1c2a36;
              }
            .funIcons {
                margin: 20px 10px 10px;
                border: 1px solid rgba(255, 255, 255, 0.11);
                line-height: 40px;
                height: 40px;
                border-radius: 6px;
            }
            .funIconItem {
                float: left;
                width: 25%;
                color: #79a1ba;
                text-align: center;
                font-size: 14px;
                height: 38px;
                transition: box-shadow 0.3s, font-size 0.1s;
                transition-timing-function: ease-in;
                cursor: pointer;
                opacity: 1; 
                transform: translate(0px, 0px);
            }
            .funIconItem:hover {
                box-shadow: inset 0 0 20px 0px #79a1ba;
                font-size: 18px;
            }
            .sysitems {
                padding: 10px;
                overflow: auto;
                width: 420px;
                min-height: 90px;
            }
            .sysitem {
              position: relative;
              float: left;
              display: block;
              width: 90px;
              height: 90px;
              color: #79a1ba;
              margin: 2px 5px;
          }
          .sysitem:hover {
              background-color: #323e4a;
              color: #fff;
              cursor: pointer;
              box-shadow: 0px 0px 3px #8d8f90;
              border-radius: 3px;
          }
          .sysitemicon {
              display: block;
              width: 35px;
              height: 35px;
              margin: 20px auto 5px auto;
              background-size: 35px 105px;
              transition: background-position-y 0.3s;
              
          }
          .icon1{
            background-image: url(${require("../resource/edept-other.png")});
          }
          .icon2{
            background-image: url(${require("../resource/emonitor-other.png")});
          }
          .icon3{
            background-image: url(${require("../resource/eworkspace-other.png")});
          }
          .icon4{
            background-image: url(${require("../resource/edept-other.png")});
          }
          .sysitem:hover .sysitemicon {
              background-position-y: -35px;
          }
          .sysitemname {
              position: absolute;
              width: 100%;
              bottom: 0;
              line-height: 30px;
              height: 30px;
              overflow: hidden;
              white-space: nowrap;
              vertical-align: bottom;
              -ms-text-overflow: ellipsis;
              text-overflow: ellipsis;
              padding: 0 5px;
              text-align: center;
          }
          .systemsFooter {
              margin: 10px 10px 0;
              border-top: 1px solid rgba(255, 255, 255, 0.27);
              line-height: 50px;
              height: 50px;
          }
          .logoutIcon {
            color: aquamarine;
            font-size: inherit;
            font-size: 16px;
            cursor: pointer;
        }
        .logoutIcon:hover {
            text-shadow: 0px 0px 20px white;
            color: #00ffa9;
        }




        .alarmclear{
          /* height: 46px; */
          line-height: 46px;
          text-align: center;
          color: rgb(121, 161, 186);
          border-radius: 0 0 4px 4px;
          border-top: 1px solid rgba(255, 255, 255, 0.27);
          -webkit-transition: all .3s;
          -o-transition: all .3s;
          transition: all .3s;
          cursor: pointer;
        }
          .myalarm {
            
          }
          .alarmList{
            font-family: "Helvetica Neue For Number", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
            font-size: 14px;
            line-height: 1.5;
            color: rgba(0, 0, 0, 0.65);
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            list-style: none;
            position: relative;

            height: 303px;
            overflow: auto;
          }

          .alarm-list-item{
            -webkit-transition: all .3s;
            -o-transition: all .3s;
            transition: all .3s;
            overflow: hidden;
            cursor: pointer;
            padding-left: 24px;
            padding-right: 24px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.27);
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            padding-top: 12px;
            padding-bottom: 12px;
          }
          .alarm-list-item:hover{
            background-color: #15436dba;
          }
          .alarm-list-item-meta{
            width: 100%;
            -webkit-box-align: start;
            -ms-flex-align: start;
            align-items: flex-start;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            font-size: 0;
            outline: none;
          }
          .alarm-list-item-meta-content{

            -webkit-box-flex: 1;
            -ms-flex: 1 0;
            flex: 1 0;
          }
          .alarm-list-item-meta-title{
            color: rgb(121, 161, 186);
            margin-bottom: 4px;
            font-size: 14px;
            line-height: 22px;
          }
          .alarm-list-item-meta-title .title-alarm{
            font-weight: normal;
             margin-bottom: 8px;
          }
          .alarm-list-item-meta-title .title-alarm .extra-alarm{
            float: right;
            color: rgba(0, 0, 0, 0.45);
            font-weight: normal;
            margin-right: 0;
            margin-top: -1.5px;
          }
          .alarm-list-item-meta-description{

            color: rgba(255, 255, 255, 0.27);
            font-size: 14px;
            line-height: 22px;
          }
          .alarm-list-item-meta-description .datetime-alarm{
            font-size: 12px;
            margin-top: 4px;
            line-height: 1.5;
          }
          .alarm-list-item-meta-description .desc-alarm{
            font-size: 12px;
             line-height: 1.5;
          }
.red-alarm {
    color: #ffa39e;
    background: transparent;
    border-color: #ffa39e;
}
.green-alarm{
    color: #b7eb8f;
    background: transparent;
    border-color: #b7eb8f;
}

#alarmList::-webkit-scrollbar-track
          {
            background: #ddd;
            border: thin solid lightgray;
            box-shadow: 0px 0px 2px #f6f6f6 inset;
            -moz-box-shadow: 0px 0px 2px #f6f6f6 inset;
            -webkit-box-shadow: 0px 0px 2px #f6f6f6 inset;
            -o-box-shadow: 0px 0px 2px #f6f6f6 inset;
          }

          #alarmList::-webkit-scrollbar
          {
            width: 2px;
            height: 2px;
          }

          #alarmList::-webkit-scrollbar-thumb
          {
            background: #373737;
    border: thin solid #000;
          }

          .notFound-alarm{
            text-align: center;
            padding: 73px 0 88px 0;
            color: rgb(121, 161, 186);
          }
        .alarm-list-item:hover .removeAlarm{
          display:block;
        }
        .removeAlarm{
          position: absolute;
          display:none;
            right:10px;
            bottom:5px;
        }
        `}
          </style>
          </div>
        </header>
      );
    }
  }
);
export default connect(mapStateToProps)(mainHeader);
