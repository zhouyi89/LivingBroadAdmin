import React from 'react';
import { Layout, Table, Button, Form, Input, Affix, Popover, Spin, Breadcrumb, Tabs, Icon, Select,Badge,Modal,Collapse,Alert ,message } from 'antd';
import { netdata } from './../../helper'
import RegionTree from './regionTree'

import SysbasicForm from './dxwg/SysbasicForm'
import Systraptable from './dxwg/Systraptable'
import Systraptableyy from './yyhc/Systraptable'
import CannelTable from './yyhc/CannelTable'
import RadchTable from './yyhc/radchTable'
import Basicphonemodule from './dxwg/Basicphonemodule'
import Basicauthmember from './dxwg/Basicauthmember'
import BasicinfoForm from './bkj/BasicinfoForm'
import Netserverform from './dxwg/Netserverform'
import Netbasicform from './dxwg/Netbasicform'
import Netsoftinfo from './dxwg/Netsoftinfo'
import QAMtable from './yz/QAMtable'
import Basicinfoyzform from './yz/Basicinfoyzform'
import QAMform from './yz/QAMform'
import Netserveryzform from './yz/Netserveryzform'

import createStore from '../createStore';
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Option = Select.Option;
const Panel = Collapse.Panel;
const { Header, Content, Sider } = Layout;
const SysbasicFormIN = Form.create()(SysbasicForm);
const NetserverformIN = Form.create()(Netserverform);
const NetbasicformIN = Form.create()(Netbasicform);
const NetsoftinfoIN = Form.create()(Netsoftinfo);
const BasicinfoFormIN = Form.create()(BasicinfoForm);
const BasicinfoyzformIN = Form.create()(Basicinfoyzform);
const QAMformIN = Form.create()(QAMform);
const NetserveryzformIN = Form.create()(Netserveryzform);
let lastdevs=[];

class deviceMana extends React.Component {
    constructor(props) {
        super(props);
    this.store = createStore({
        id:"",
        regionname:"",
        devicesList:[],
        deviceDATA:[]
      });
    }
    state = {
        sourcedata: [],
        loading: false,
        visiblef1:false,
        visiblef2:false,
        visiblef3:false,
        visiblef4:false,
        visiblef5:false,
        regionname:"",
        devicesList:[],
        checkname:"",
        checkid:"",
        checkstate:""
    };

 



    backbutton(type){
        switch (type) {
            case "f1":
                this.setState({visiblef1:false})
                break;
            case "f2":
                this.setState({visiblef2:false})
                break;
            case "f3":
                this.setState({visiblef3:false})
                break;
            case "f4":
                this.setState({visiblef4:false})
                break;
            case "f5":
                this.setState({visiblef5:false})
                break;
            default:
                break;
        }
        this.setState({visiblef3:false})
    }
    reloadbutton(){
        this.reload();
    }
    savebutton2(){
        let that=this;
        const { id,deviceDATA } = this.store.getState();
        let postdata={"opt": "MfyValue", "id":id.toString()} 
        let subs={}
       
        let Netbasicform =this.Netbasicformyy.subDATA();
        let Netserverform =this.Netserverformyy.subDATA();
        let SysbasicForm =this.SysbasicFormyy.subDATA();
        let Systraptable =this.refs.Systraptableyy.subDATA();
        let RadchTableyy =this.refs.RadchTableyy.subDATA();
        var obj = Object.assign(Netbasicform, Netserverform, SysbasicForm);
        for(var i in Systraptable[0]){
            if(deviceDATA["lt2IpaTrapIP"+i]!=Systraptable[0][i]){
                subs["lt2IpaTrapIP"+i]=Systraptable[0][i]
            }
        }
        for(var i in Systraptable[1]){
            if(deviceDATA["lt2IpaTrapCommunity"+i]!=Systraptable[1][i]){
                subs["lt2IpaTrapCommunity"+i]=Systraptable[1][i]
            }
        }
        for(var i in Systraptable[2]){
            if(deviceDATA["lt2IpaTrapStatus"+i]!=Systraptable[2][i]){
                subs["lt2IpaTrapStatus"+i]=Systraptable[2][i]
            }
        }
            if(deviceDATA["TimbreSelect"]!=RadchTableyy[0]){
                subs["TimbreSelect"]=RadchTableyy[0]
            }
        for(var dd in obj){
            if(deviceDATA[dd]!=obj[dd]){
                subs[dd]=obj[dd]
            }
        }
        var pp = Object.assign(postdata, subs);
        let r = {
            method: "POST",
            body: JSON.stringify(pp)
          }
          netdata('/NMS/UpdateDevs.epy', r).then(that.ondata1.bind(this));
    }
    savebutton1(){
        let that=this;
        const { id,deviceDATA } = this.store.getState();
        let postdata={"opt": "MfyValue", "id":id.toString()} 
        let subs={}
        let subs1={}
        let Netserveryzformyz =this.Netserveryzformyz.subDATA();
        let Basicinfoyzformyz =this.Basicinfoyzformyz.subDATA();
        let QAMformyz=this.QAMformyz.subDATA();
        // let Netserverform =this.Netserverformyz.subDATA();
        let SysbasicForm =this.SysbasicFormyz.subDATA();
        let Systraptable =this.refs.Systraptableyz.subDATA();
        let QAMtable =this.refs.QAMtableyz.subDATA();
        var obj = Object.assign(Netserveryzformyz,Basicinfoyzformyz,QAMformyz, SysbasicForm);
        for(var i in Systraptable[0]){
            if(deviceDATA["lt2IpaTrapIP"+i]!=Systraptable[0][i]){
                subs["lt2IpaTrapIP"+i]=Systraptable[0][i]
            }
        }
        for(var i in Systraptable[1]){
            if(deviceDATA["lt2IpaTrapCommunity"+i]!=Systraptable[1][i]){
                subs["lt2IpaTrapCommunity"+i]=Systraptable[1][i]
            }
        }
        for(var i in Systraptable[2]){
            if(deviceDATA["lt2IpaTrapStatus"+i]!=Systraptable[2][i]){
                subs["lt2IpaTrapStatus"+i]=Systraptable[2][i]
            }
        }

        for(var i in QAMtable[0]){
            if(deviceDATA["ebsDigitalFrequency"+i]!=QAMtable[0][i]){
                subs1["ebsDigitalFrequency"+i]=QAMtable[0][i]
            }
        }
        for(var i in QAMtable[1]){
            if(deviceDATA["ebsDigitalQAM"+i]!=QAMtable[1][i]){
                subs1["ebsDigitalQAM"+i]=QAMtable[1][i]
            }
        }       
        for(var i in QAMtable[2]){
            if(deviceDATA["ebsDigitalSymbolrate"+i]!=QAMtable[2][i]){
                subs1["ebsDigitalSymbolrate"+i]=QAMtable[2][i]
            }
        }

        for(var i in QAMtable[3]){
            if(deviceDATA["ebsDigitalMode"+i]!=QAMtable[3][i]){
                subs1["ebsDigitalMode"+i]=QAMtable[3][i]
            }
        }for(var dd in obj){
            if(deviceDATA[dd]!=obj[dd]){
                subs[dd]=obj[dd]
            }
        }
        var pp = Object.assign(postdata, subs,subs1);
        let r = {
            method: "POST",
            body: JSON.stringify(pp)
          }
          netdata('/NMS/UpdateDevs.epy', r).then(that.ondata1.bind(this));
    }
    savebutton5(){
        let that=this;
        const { id,deviceDATA } = this.store.getState();
        let postdata={"opt": "MfyValue", "id":id.toString()} 
        let subs={}
       
        let Netbasicform =this.Netbasicformbkj.subDATA();
        let Netserverform =this.Netserverformbkj.subDATA();
        let SysbasicForm =this.SysbasicFormbkj.subDATA();
        let BasicinfoFormbkj = this.BasicinfoFormbkj.subDATA();
        let Systraptable =this.refs.Systraptablebkj.subDATA();

        var obj = Object.assign(BasicinfoFormbkj,Netbasicform, Netserverform, SysbasicForm);
        for(var i in Systraptable[0]){
            if(deviceDATA["lt2IpaTrapIP"+i]!=Systraptable[0][i]){
                subs["lt2IpaTrapIP"+i]=Systraptable[0][i]
            }
        }
        for(var i in Systraptable[1]){
            if(deviceDATA["lt2IpaTrapCommunity"+i]!=Systraptable[1][i]){
                subs["lt2IpaTrapCommunity"+i]=Systraptable[1][i]
            }
        }
        for(var i in Systraptable[2]){
            if(deviceDATA["lt2IpaTrapStatus"+i]!=Systraptable[2][i]){
                subs["lt2IpaTrapStatus"+i]=Systraptable[2][i]
            }
        }
        for(var dd in obj){
            if(deviceDATA[dd]!=obj[dd]){
                subs[dd]=obj[dd]
            }
        }
        var pp = Object.assign(postdata, subs);
        let r = {
            method: "POST",
            body: JSON.stringify(pp)
          }
          netdata('/NMS/UpdateDevs.epy', r).then(that.ondata1.bind(this));
    }
    savebutton3(){
        let that=this;
        const { id,deviceDATA } = this.store.getState();
        let postdata={"opt": "MfyValue", "id":id.toString()} 
        let subs={}
       
        let Netbasicform =this.Netbasicform.subDATA();
        let Netserverform =this.Netserverform.subDATA();
        let SysbasicForm =this.SysbasicForm.subDATA();
        let Systraptable =this.refs.Systraptable.subDATA();

        var obj = Object.assign(Netbasicform, Netserverform, SysbasicForm);
        for(var i in Systraptable[0]){
            if(deviceDATA["lt2IpaTrapIP"+i]!=Systraptable[0][i]){
                subs["lt2IpaTrapIP"+i]=Systraptable[0][i]
            }
        }
        for(var i in Systraptable[1]){
            if(deviceDATA["lt2IpaTrapCommunity"+i]!=Systraptable[1][i]){
                subs["lt2IpaTrapCommunity"+i]=Systraptable[1][i]
            }
        }
        for(var i in Systraptable[2]){
            if(deviceDATA["lt2IpaTrapStatus"+i]!=Systraptable[2][i]){
                subs["lt2IpaTrapStatus"+i]=Systraptable[2][i]
            }
        }
        for(var dd in obj){
            if(deviceDATA[dd]!=obj[dd]){
                subs[dd]=obj[dd]
            }
        }
        var pp = Object.assign(postdata, subs);
        let r = {
            method: "POST",
            body: JSON.stringify(pp)
          }
          netdata('/NMS/UpdateDevs.epy', r).then(that.ondata1.bind(this));
    }

    ondata1(res) {
        if (res.d.errCode == 0) {
            // this.setState({visiblef3:false})
            message.success("修改成功！");  
        }
        else{
          message.error(res.d.Body);  
        }
    }
    componentWillMount(){
        this.store.subscribe(() => {
            const { regionname,devicesList } = this.store.getState();
            this.setState({ regionname: regionname,devicesList:devicesList });
          });

    }
    
    tabchange(key){
        let that =this;
        switch (key) {
            case "1":
                [].forEach.call(document.querySelectorAll(".deviceItem"), function (item) {
                    item.setAttribute("style", "")
                });
                [].forEach.call(document.querySelectorAll(".onedeviceWrap"), function (item) {
                    let  deviceItems= item.querySelectorAll(".deviceItems")
                  let  devicenormal= item.querySelectorAll(".devicenormal")
                  let  deviceclose= item.querySelectorAll(".deviceclose")
                  let lg =devicenormal.length+deviceclose.length
                   if(lg==0){
                       item.querySelector(".devicenull").setAttribute("style", "")
                   }
                   else{
  
                           item.querySelector(".devicenull").setAttribute("style", "display:none")
                    }
                 });
                break;
            case "2":   
                [].forEach.call(document.querySelectorAll(".deviceItem"), function (item) {
                    item.setAttribute("style", "display:none")
                });
                [].forEach.call(document.querySelectorAll(".devicenull"), function (item) {
                    item.setAttribute("style", "")
                });
                [].forEach.call(document.querySelectorAll(".devicenormal"), function (item) {
                    item.setAttribute("style", "")
                });
                [].forEach.call(document.querySelectorAll(".onedeviceWrap"), function (item) {
                         let  deviceItems= item.querySelectorAll(".deviceItems")
                       let  devicenormal= item.querySelectorAll(".devicenormal")
                       let  deviceclose= item.querySelectorAll(".deviceclose")
                       let lg =devicenormal.length+deviceclose.length
                        if(lg==0){
                            item.querySelector(".devicenull").setAttribute("style", "")
                        }
                        else{
                            if(devicenormal.length==0){
                                item.querySelector(".devicenull").setAttribute("style", "")
                             }else{
                                item.querySelector(".devicenull").setAttribute("style", "display:none")
                             }
                         }
                });

                break;  
            case "3":
                [].forEach.call(document.querySelectorAll(".deviceItem"), function (item) {
                    item.setAttribute("style", "display:none")
                });
                [].forEach.call(document.querySelectorAll(".devicenull"), function (item) {
                    item.setAttribute("style", "")
                });
                [].forEach.call(document.querySelectorAll(".deviceclose"), function (item) {
                    item.setAttribute("style", "")
                });
                [].forEach.call(document.querySelectorAll(".onedeviceWrap"), function (item) {
                    let  deviceItems= item.querySelectorAll(".deviceItems")
                    let  devicenormal= item.querySelectorAll(".devicenormal")
                    let  deviceclose= item.querySelectorAll(".deviceclose")
                    let lg =devicenormal.length+deviceclose.length
                     if(lg==0){
                        item.querySelector(".devicenull").setAttribute("style", "")
                     }
                     else{
                         if(deviceclose.length==0){
                            item.querySelector(".devicenull").setAttribute("style", "")
                         }else{
                            item.querySelector(".devicenull").setAttribute("style", "display:none")
                         }
                        
                      }
             });
                break;   
            default:
                break;
        }
    }
    componentDidMount() {

        let that =this;
        [].forEach.call(document.querySelectorAll(".deviceCode"), function (item) {

            item.addEventListener('click', function (e) {
                [].forEach.call(document.querySelectorAll(".deviceCode"), function (item) {
                    item.setAttribute("class", "deviceCode")
                });
                if(e.target.type=="all"){
                    [].forEach.call(document.querySelectorAll(".deviceWrap"), function (item) {
                        item.setAttribute("class", "deviceWrap deviceshow")
                    });
                }
                else{
                    [].forEach.call(document.querySelectorAll(".deviceWrap"), function (item) {
                        item.setAttribute("class", "deviceWrap devicehide")
                    });
                    document.getElementById(e.target.type).setAttribute("class", "deviceWrap deviceshow")
                }
                e.target.setAttribute("class", "deviceCode deviceActive")
            });

        });

        window.onresize = function(){
             var height1 = (window.innerHeight-64) + "px";
            try {
              document.getElementById("myregiontreediv").style.height =height1;
            } catch (error) {
      
            }
          };
    };
    wraphandler = function () {
        this.setState({visible:true})
    };

    devitemClick(id,name,state,type){
        // if(type==="f1"){
        //     this.setState({visiblef1:true})
        //     return;  
        // }
        let tt =""
        switch (type) {
            case "f1":
                tt=" (音柱)"
                break;
            case "f2":
                tt=" (多路语音合成器)"
                break;
            case "f3":
                tt=" (电话短信网关)"
                break;
            case "f4":
                tt=" (数字编码控制器)"
                break;
            case "f5":
                tt=" (播出控制器)"
                break;
            default:
                break;
        }
        let that =this;this.setState({checkname:name+tt,checkid:id,checkstate:state})
        // console.log(id,name,state,type)
        let r = {
            method: "POST",
            body: JSON.stringify({"opt": "UpdateDev", "id":id.toString(),"cksnmp":"0"})
          }
          netdata('/NMS/UpdateDevs.epy', r).then(that.ondata.bind(this,type,id));
        
        
    }
    reload(){
        let that =this;
        this.setState({loading:true})
        let r = {
            method: "POST",
            body: JSON.stringify({"opt": "UpdateDev", "id":this.state.checkid,"cksnmp":"1"})
          }
          netdata('/NMS/UpdateDevs.epy', r).then(that.reloadondata.bind(this));
    }

    reloadondata(res){
        if (res.d.errCode == 0) {
            let Vs = res.d.Body;
            this.store.setState({deviceDATA:Vs,id:this.state.checkid})   
            message.success("刷新成功！");   
            this.setState({loading:false})         
        }
        else{
          message.error(res.d.Body);  this.setState({loading:false})   
        }
    }


    ondata(type,id,res) {
          if (res.d.errCode == 0) {
              switch (type) {
                  case "f1":
                  this.setState({visiblef1:true})
                      break;
                  case "f2":
                  this.setState({visiblef2:true}) 
                      break;
                  case "f3":
                  this.setState({visiblef3:true})
                      break;
                  case "f4":
                  this.setState({visiblef4:true})    
                      break;
                  case "f5":
                  this.setState({visiblef5:true}) 
                      break;
                  default:
                      break;
              }
              let Vs = res.d.Body;
              this.store.setState({deviceDATA:Vs,id:id})  ; 
            //   this.reload();          
          }
          else{
            message.error(res.d.Body);  
          }
      }
    renderdeviceWrap(devlist,type){
        let that =this;
        if(typeof(devlist)=="undefined"){
            return;
        }
        if(devlist.length==0){
            return (<div className="deviceItem devicenull" >                
            <strong>
                未发现设备
            </strong>
                     </div>)
        }
        var wrap = devlist.map(function (item) {
            const content = (
                <div className="roomContent" style={{padding: "0px 8px"}}>
                    <ul className="roomContList">
                        <li>
                            <span>
                                逻辑地址：
                            </span>
                            {item.logicaddr}
                        </li>
                        <li>
                            <span>
                                网管 I P：
                            </span>
                            {item.NetManageIp}
                        </li>
                        <li>
                            <span>
                                读字符串：
                            </span>
                            {item.ReadStr}
                        </li>
                        <li>
                            <span>
                                写字符串：
                            </span>
                            {item.WriteStr}
                        </li>
                        <li>
                            <span>
                                是否网管：
                            </span>
                            {item.IsNetworkManage=="0"?"×":"√"}
                        </li>
                    </ul>
                    
                </div>
              );
  if(item.IsNetworkManage!=="0") {
           switch(item.state){
                case 0:     
                return (<Popover title={<Badge status="success" text={item.desc} />} placement="rightTop"  content={content} >
                   
                        {/* <div className="deviceItem devicenormal" onClick={()=>{that.setState({visible:true})}}>                 */}
                        <div className="deviceItem devicenormal" onClick={()=>{that.devitemClick(item.id,item.desc,item.state,type)}}>                

                            <strong style={{maxWidth:"91px"}}>
                                {item.desc}
                            </strong>
                            <p>           
                            <Badge status="success" text="正常" />
                            </p>
                        </div>
               
                     </Popover>)
                break;
                case 1:     
                return (<Popover title={<Badge status="success" text={item.desc} />} placement="rightTop"  content={content} >
                   
                        {/* <div className="deviceItem devicenormal" onClick={()=>{that.setState({visible:true})}}>                 */}
                        <div className="deviceItem devicenormal" onClick={()=>{that.devitemClick(item.id,item.desc,item.state,type)}}>                

                            <strong style={{maxWidth:"91px"}}>
                                {item.desc}
                            </strong>
                            <p>           
                            <Badge status="success" text="正常" />
                            </p>
                        </div>
               
                     </Popover>)
                break;
                case 4:
                return (<Popover title={<Badge status="error" text={item.desc} />}  placement="rightTop"  content={content} >
                    <div className="deviceItem deviceclose" onClick={()=>{that.devitemClick(item.id,item.desc,item.state,type)}}>             
                        <strong style={{maxWidth:"91px"}}>
                            {item.desc}
                        </strong>
                        <p>           
                        <Badge status="error" text="离线" />
                        </p>
                    </div>
                 </Popover>)
                break;
                case 2:
                return (<Popover title={<Badge status="error" text={item.desc} />}  placement="rightTop"  content={content} >
                    <div className="deviceItem deviceerror">            
                        <strong style={{maxWidth:"91px"}}>
                            {item.desc }
                        </strong>
                        <p>           
                        <Badge status="processing" text="异常" />
                        </p>
                    </div>
                 </Popover>)
                break;
            }  

  }
 
  
          });
     wrap.push((<div className="deviceItem devicenull" style={{display:"none"}}>                
     <strong>
         未发现设备
     </strong>
              </div>))
        return wrap
    }

    render() {
        const data = [
            {
              title: 'Ant Design Title 1',
            },
            {
              title: 'Ant Design Title 2',
            },
            {
              title: 'Ant Design Title 3',
            },
            {
              title: 'Ant Design Title 4',
            },
          ];

        return (
            <Layout >
                {/* <Sider id="myregiontreediv" width={275} style={{ height: window.innerHeight - 64, background: '#fff', boxShadow: "1px 0px 6px #dcd0d0", overflow: 'auto', position: 'fixed', left: this.props.mleft}}> */}
                <Sider id="myregiontreediv" width={275} style={{ height: window.innerHeight - 64, background: '#fff', boxShadow: "1px 0px 6px #dcd0d0", overflow: 'auto', position: 'fixed', left: 0}}>
                    <RegionTree store={this.store}/>
                </Sider>
                <Layout>
                    <Content>
                        <div id="affix" >
                            <Affix offsetTop={64}>
                                <div className="table-operations">
                                    <span>
                                        <Breadcrumb style={{ fontSize: "14px" }}>
                                            {/* <Breadcrumb.Item>江苏</Breadcrumb.Item>
                                            <Breadcrumb.Item>无锡</Breadcrumb.Item> */}
                                            <Breadcrumb.Item>{this.state.regionname}</Breadcrumb.Item>
                                        </Breadcrumb>
                                    </span>
                                    <Tabs onChange={this.tabchange.bind(this)} type="card" style={{ position: "absolute", left: "36%", top: "18px" }}>
                                        <TabPane tab={<span><Icon type="laptop" />全部 </span>} key="1"></TabPane>
                                        <TabPane tab={<span><Icon type="check" />正常 </span>} key="2"></TabPane>
                                        {/* <TabPane tab={<span><Icon type="exclamation" />异常 8</span>} key="3"></TabPane> */}
                                        <TabPane tab={<span><Icon type="link" />离线</span>} key="3"></TabPane>
                                    </Tabs>
                                    <span>
                                        <Select defaultValue="card" type="primary" >
                                            <Option value="card">卡片模式</Option>
                                            <Option value="list">列表模式</Option>
                                        </Select>
                                    </span>
                                </div>
                            </Affix>
                            <div style={{ padding: "16px 16px", backgroundColor: "#fff", display: "flex" }}>
                                
                                <div className="cardSider">
                            <Affix offsetTop={130}>
                                <div>
                                    <a type="all" className="deviceCode deviceActive">
                                        全部
                                    </a>
                                    <a type="f1" className="deviceCode">
                                        音柱
                                    </a>
                                    <a type="f2" className="deviceCode">
                                         多路语音
                                    </a>
                                    <a type="f3" className="deviceCode">
                                    短信网关
                                    </a>
                                    <a type="f4" className="deviceCode">
                                    数字编码
                                    </a>
                                    <a type="f5" className="deviceCode">
                                    播出控制器
                                    </a>
                                </div>
                             </Affix>
                                </div>
                              
                                <div className="cardContent">
                                    <div id="f1" className="deviceWrap">
                                        <div className="onedeviceWrap" >
                                            <div className="service-icon">
                                            <Icon type="notification" />
                                            </div>
                                            <div className="service-txt">
                                            音柱
                                            </div>
                                            {this.renderdeviceWrap(this.state.devicesList.dev1,"f1")}      
                                        </div>
                                    </div>
                                    <div id="f2" className="deviceWrap">

                                        <div className="onedeviceWrap">
                                        <div className="service-icon">
                                                     <Icon type="hdd" />
                                            </div>
                                            <div className="service-txt">
                                            多路语音合成器
                                            </div>
                                            {this.renderdeviceWrap(this.state.devicesList.dev2,"f2")}  
                                        </div>
                                    </div>
                                    <div id="f3" className="deviceWrap">
                   
                                        <div className="onedeviceWrap">
                                        <div className="service-icon">
                                        <Icon type="cloud-o" />
                                            </div>
                                            <div className="service-txt">
                                                 电话短信网关
                                            </div>
                                             {this.renderdeviceWrap(this.state.devicesList.dev3,"f3")} 
                                        </div>
                                    </div>
                                    <div id="f4" className="deviceWrap">
      
                                        <div className="onedeviceWrap">
                                        <div className="service-icon">
                                        <Icon type="inbox" />
                                            </div>
                                            <div className="service-txt">
                                            数字编码控制器
                                            </div>
                                        {this.renderdeviceWrap(this.state.devicesList.dev4,"f4")} 
                                        </div>
                                    </div>
                                    <div id="f5" className="deviceWrap">
                        
                                        <div className="onedeviceWrap">
                                        <div className="service-icon">
                                        <Icon type="video-camera" />
                                            </div>
                                            <div className="service-txt">
                                            播出控制器
                                            </div>
                                        {this.renderdeviceWrap(this.state.devicesList.dev5,"f5")} 
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </Content>
                </Layout>
                <Modal width="100%" wrapClassName="mymodalwrap" zIndex="999" visible={this.state.visiblef3} footer={null} mask={false} closable={false}>
                     <Spin size="large"  tip="加载中..." spinning={this.state.loading}>
                        <div style={{height: "100%", width: "80%", float: "left"}}>
                                <div className="topbar">
                                <Button
                                        type="primary"
                                        icon="save"
                                        style={{marginRight:"10px",float:"right"}}
                                        onClick={this.savebutton3.bind(this)}
                                    >
                                        保 存
                                    </Button>
                                    
                                <Button
                                        icon="rollback"
                                        style={{marginRight:"10px",float:"right"}}
                                        onClick={this.backbutton.bind(this,"f3")}
                                    >
                                        返 回
                                    </Button>
                                    <Button
                                        icon="reload"
                                        style={{marginRight:"10px",float:"right"}}
                                        onClick={this.reloadbutton.bind(this)}
                                    >
                                        刷新
                                    </Button>
                                    <span className="ant-badge ant-badge-status ant-badge-not-a-wrapper" style={{margin: "2px"}}                                     
                                >
                                {this.state.checkstate==0?    <span className="ant-badge-status-dot ant-badge-status-success" style={{width: "12px",height: "12px",position:"relative"}}>
                                <div className="dotafter"/>
                            </span>:<span className="ant-badge-status-dot ant-badge-status-error" style={{width: "12px",height: "12px",position:"relative"}}>
                                <div className="dotafter-error"/>
                            </span>}
                                            <span className="ant-badge-status-text" style={{fontSize: "16px"}}                                           
                                                 >
                                               {this.state.checkname}
                                            </span>
                                        </span>
                                </div>
                            {/* </Affix> */}
                            <Tabs tabPosition="top" id="mytab" animated={true} >
                                <TabPane tab="基本信息" key="1" forceRender={true}>                           
                                    <div id="livecontent" style={{backgroundColor:"#FFF",padding:" 17px 19px"}}>
                                        <Collapse bordered={false}   defaultActiveKey={['1','2','3']}>
                                            <Panel disabled showArrow={false} header="电话模块" key="1" >
                                                <Basicphonemodule store={this.store}/>
                            
                                            </Panel>
                                        </Collapse>
                                    </div>
                            </TabPane>
                                <TabPane tab="授权号码" key="2" forceRender={true}>                           
                                        <div id="livecontent" className="overflowdiv" style={{backgroundColor:"#FFF",padding:" 17px 19px"}}>
                                            <Collapse bordered={false}   defaultActiveKey={['1','2','3']}>
                                                <Panel disabled showArrow={false} header="授权号码" key="1" >
                                                    <Basicauthmember store={this.store}/>
                                                </Panel>
                                            </Collapse>
                                        </div>
                                </TabPane>
                                <TabPane tab="网络参数" key="3" forceRender={true}>
                                    <div id="livecontent" className="overflowdiv" style={{backgroundColor:"#FFF",padding:" 17px 19px"}}>
                                        <Collapse bordered={false}   defaultActiveKey={['1','2','3']}>
                                            <Panel disabled showArrow={false} header="本地设置" key="1" >
                                                 <NetbasicformIN store={this.store} wrappedComponentRef={(inst) => this.Netbasicform = inst}/>
                                            </Panel>
                                            <Panel disabled showArrow={false} header="设备信息" key="2" >
                                                 <NetsoftinfoIN store={this.store}/>
                                            </Panel>
                                            <Panel disabled showArrow={false}  header="服务设置" key="3" >
                                                 <NetserverformIN store={this.store} wrappedComponentRef={(inst) => this.Netserverform = inst}/>
                                            </Panel>
                                        </Collapse>
                                    </div>                                    

                                </TabPane>
                                <TabPane tab="系统参数" key="4" forceRender={true}>
                                      <div id="livecontent" className="overflowdiv" style={{backgroundColor:"#FFF",padding:" 17px 19px"}}>
                                        <Collapse bordered={false}   defaultActiveKey={['1','2','3']}>
                                            <Panel disabled showArrow={false} header="系统参数" key="1" >
                                                <SysbasicFormIN  store={this.store}  wrappedComponentRef={(inst) => this.SysbasicForm = inst}/>
                                            </Panel>
                                            <Panel disabled showArrow={false}  header="AgentTrap设置" key="2" >
                                                <Systraptable store={this.store} ref="Systraptable"/>
                                            </Panel>
                                        </Collapse>
                                    </div>

                                </TabPane>
                            </Tabs>
                        </div>
                        <div style={{height: "100%", width: "20%", float: "left",borderLeft: "1px solid rgb(233, 233, 233)"}}>
                             <div className="topbar">
                                        <div style={{fontSize: "14px",paddingTop: "7px"}}>设备日志</div>
                            </div>


                                <div className="leftcontent"style={{height: window.innerHeight-64-48}} > 
                               
                                <div className="logWrapper">
                                    <h2 className="titleBar">
                                        2018-03-19
                                    </h2>
                                    <div className="logitem">
                                        <div className="logtop">
                                            <span className="logdate">
                                                23:59:59
                                            </span>
                                            <span className="logname">
                                                系统
                                            </span>
                                        </div>
                                        <p className="logcontent">
                                            修改音柱参数『21213123』213
                                        </p>
                                    </div>
                                    <div className="logitem">
                                        <div className="logtop">
                                            <span className="logdate">
                                                21:59:59
                                            </span>
                                            <span className="logname">
                                                系统
                                            </span>
                                        </div>
                                        <p className="logcontent">
                                            修改音柱参数『2123123』
                                        </p>
                                    </div>
                                    <div className="logitem">
                                        <div className="logtop">
                                            <span className="logdate">
                                                13:59:59
                                            </span>
                                            <span className="logname">
                                                系统
                                            </span>
                                        </div>
                                        <p className="logcontent">
                                            修改音柱参数『212123123』12
                                        </p>
                                    </div>
                                </div>


                                </div>
  
                        </div>  
                     </Spin>                
                </Modal>
                <Modal width="100%" wrapClassName="mymodalwrap" zIndex="999" visible={this.state.visiblef1} footer={null} mask={false} closable={false}>
                                {/* <Affix offsetTop={64} style={{left:"275px"}}> */}
                        <Spin size="large"  tip="加载中..." spinning={this.state.loading}>
                        <div style={{height: "100%", width: "80%", float: "left"}}>
                     
                                <div className="topbar">
                                <Button
                                        type="primary"
                                        icon="save"
                                        style={{marginRight:"10px",float:"right"}}
                                        onClick={this.savebutton1.bind(this)}
                                    >
                                        保 存
                                    </Button>
                                    
                                <Button
                                        icon="rollback"
                                        style={{marginRight:"10px",float:"right"}}
                                        onClick={this.backbutton.bind(this,"f1")}
                                    >
                                        返 回
                                    </Button>
                                    <Button
                                        icon="reload"
                                        style={{marginRight:"10px",float:"right"}}
                                        onClick={this.reloadbutton.bind(this)}
                                    >
                                        刷新
                                    </Button>
                                    <span className="ant-badge ant-badge-status ant-badge-not-a-wrapper" style={{margin: "2px"}}                                     
                                >
                                        {this.state.checkstate==0?    <span className="ant-badge-status-dot ant-badge-status-success" style={{width: "12px",height: "12px",position:"relative"}}>
                                                <div className="dotafter"/>
                                            </span>:<span className="ant-badge-status-dot ant-badge-status-error" style={{width: "12px",height: "12px",position:"relative"}}>
                                                <div className="dotafter-error"/>
                                            </span>}
                                            <span className="ant-badge-status-text" style={{fontSize: "16px"}}                                           
                                                 >
                                               {this.state.checkname}
                                            </span>
                                        </span>
                                </div>
                            {/* </Affix> */}
                            <Tabs tabPosition="top" id="mytab" animated={true} >
                                <TabPane tab="基本信息" key="1" forceRender={true}>                           
                                    <div id="livecontent" className="overflowdiv" style={{backgroundColor:"#FFF",padding:" 17px 19px"}}>
                                        <Collapse bordered={false}   defaultActiveKey={['1','2','3']}>
                                       
                                        <Panel disabled showArrow={false} header="基本信息" key="1" >
                                                    <BasicinfoyzformIN store={this.store} wrappedComponentRef={(inst) => this.Basicinfoyzformyz = inst}/>
                                            </Panel>
                                            <Panel disabled showArrow={false} header="数字参数" key="2" >
                                                   <QAMtable store={this.store} ref="QAMtableyz"/>  
                                             
                                            </Panel>
                                            <Panel disabled showArrow={false} header="PID" key="3" >
                                            <QAMformIN store={this.store}  wrappedComponentRef={(inst) => this.QAMformyz = inst}/>
                            
                                            </Panel>
                                        </Collapse>
                                    </div>
                            </TabPane>
                                <TabPane tab="服务器信息" key="2" forceRender={true}>                           
                                    <div id="livecontent" className="overflowdiv" style={{backgroundColor:"#FFF",padding:" 17px 19px"}}>
                                        <Collapse bordered={false}   defaultActiveKey={['1','2','3']}>
                                       
                                        <Panel disabled showArrow={false} header="服务器" key="1" >
                                        <NetserveryzformIN store={this.store} wrappedComponentRef={(inst) => this.Netserveryzformyz = inst}/>

                                        </Panel>
                                        </Collapse>
                                    </div>
                            </TabPane>
                            <TabPane tab="网络参数" key="3" forceRender={true}>
                            <div id="livecontent" className="overflowdiv" style={{backgroundColor:"#FFF",padding:" 17px 19px"}}>
                                <Collapse bordered={false}   defaultActiveKey={['1','2','3']}>
                                <Panel disabled showArrow={false} header="本地设置" key="1" >
                                <NetbasicformIN store={this.store} wrappedComponentRef={(inst) => this.Netbasicformyz = inst}/>
                                </Panel>
                                <Panel disabled showArrow={false} header="设备信息" key="2" >
                                        <NetsoftinfoIN store={this.store}/>
                                </Panel>
                                {/* <Panel disabled showArrow={false}  header="服务设置" key="3" >
                                        <NetserverformIN store={this.store} wrappedComponentRef={(inst) => this.Netserverformyz = inst}/>
                                </Panel> */}
                                </Collapse>
                            </div>                                    

                        </TabPane>
                        <TabPane tab="系统参数" key="4" forceRender={true}>
                              <div id="livecontent" className="overflowdiv" style={{backgroundColor:"#FFF",padding:" 17px 19px"}}>
                                <Collapse bordered={false}   defaultActiveKey={['1','2','3']}>
                                    <Panel disabled showArrow={false} header="系统参数" key="1" >
                                        <SysbasicFormIN  store={this.store}  wrappedComponentRef={(inst) => this.SysbasicFormyz = inst}/>

                                    </Panel>
                                    <Panel disabled showArrow={false}  header="AgentTrap设置" key="2" >
                                         <Systraptable store={this.store} ref="Systraptableyz"/>  
                                    </Panel>
                                </Collapse>
                            </div>

                        </TabPane>
                            </Tabs>
                        </div>
                        <div style={{height: "100%", width: "20%", float: "left",borderLeft: "1px solid rgb(233, 233, 233)"}}>
                             <div className="topbar">
                                        <div style={{fontSize: "14px",paddingTop: "7px"}}>设备日志</div>
                            </div>


                                <div className="leftcontent"style={{height: window.innerHeight-64-48}} > 
                               
                                <div className="logWrapper">
                                    <h2 className="titleBar">
                                        2018-03-19
                                    </h2>
                                    <div className="logitem">
                                        <div className="logtop">
                                            <span className="logdate">
                                                23:59:59
                                            </span>
                                            <span className="logname">
                                                系统
                                            </span>
                                        </div>
                                        <p className="logcontent">
                                            修改音柱参数『21213123』213
                                        </p>
                                    </div>
                                    <div className="logitem">
                                        <div className="logtop">
                                            <span className="logdate">
                                                21:59:59
                                            </span>
                                            <span className="logname">
                                                系统
                                            </span>
                                        </div>
                                        <p className="logcontent">
                                            修改音柱参数『2123123』
                                        </p>
                                    </div>
                                    <div className="logitem">
                                        <div className="logtop">
                                            <span className="logdate">
                                                13:59:59
                                            </span>
                                            <span className="logname">
                                                系统
                                            </span>
                                        </div>
                                        <p className="logcontent">
                                            修改音柱参数『212123123』12
                                        </p>
                                    </div>
                                </div>


                                </div>
  
                        </div>     
                        </Spin>             
                </Modal>
                <Modal width="100%" wrapClassName="mymodalwrap" zIndex="999" visible={this.state.visiblef5} footer={null} mask={false} closable={false}>
                                {/* <Affix offsetTop={64} style={{left:"275px"}}> */}
                        <Spin size="large"  tip="加载中..." spinning={this.state.loading}>
                        <div style={{height: "100%", width: "80%", float: "left"}}>
                     
                                <div className="topbar">
                                <Button
                                        type="primary"
                                        icon="save"
                                        style={{marginRight:"10px",float:"right"}}
                                        onClick={this.savebutton5.bind(this)}
                                    >
                                        保 存
                                    </Button>
                                    
                                <Button
                                        icon="rollback"
                                        style={{marginRight:"10px",float:"right"}}
                                        onClick={this.backbutton.bind(this,"f5")}
                                    >
                                        返 回
                                    </Button>
                                    <Button
                                        icon="reload"
                                        style={{marginRight:"10px",float:"right"}}
                                        onClick={this.reloadbutton.bind(this)}
                                    >
                                        刷新
                                    </Button>
                                    <span className="ant-badge ant-badge-status ant-badge-not-a-wrapper" style={{margin: "2px"}}                                     
                                >
                                        {this.state.checkstate==0?    <span className="ant-badge-status-dot ant-badge-status-success" style={{width: "12px",height: "12px",position:"relative"}}>
                                                <div className="dotafter"/>
                                            </span>:<span className="ant-badge-status-dot ant-badge-status-error" style={{width: "12px",height: "12px",position:"relative"}}>
                                                <div className="dotafter-error"/>
                                            </span>}
                                            <span className="ant-badge-status-text" style={{fontSize: "16px"}}                                           
                                                 >
                                               {this.state.checkname}
                                            </span>
                                        </span>
                                </div>
                            {/* </Affix> */}
                            <Tabs tabPosition="top" id="mytab" animated={true} >
                                <TabPane tab="基本信息" key="1" forceRender={true}>                           
                                    <div id="livecontent"  className="overflowdiv" style={{backgroundColor:"#FFF",padding:" 17px 19px"}}>
                                        <Collapse bordered={false}   defaultActiveKey={['1','2','3']}>
                                            <Panel disabled showArrow={false} header="基本信息" key="1" >
                                                <BasicinfoFormIN store={this.store} wrappedComponentRef={(inst) => this.BasicinfoFormbkj = inst}/>
                            
                                            </Panel>
                                        </Collapse>
                                    </div>
                            </TabPane>
                                <TabPane tab="网络参数" key="2" forceRender={true}>
                                    <div id="livecontent" className="overflowdiv" style={{backgroundColor:"#FFF",padding:" 17px 19px"}}>
                                        <Collapse bordered={false}   defaultActiveKey={['1','2','3']}>
                                        <Panel disabled showArrow={false} header="本地设置" key="1" >
                                        <NetbasicformIN store={this.store} wrappedComponentRef={(inst) => this.Netbasicformbkj = inst}/>
                                        </Panel>
                                        <Panel disabled showArrow={false} header="设备信息" key="2" >
                                                <NetsoftinfoIN store={this.store}/>
                                        </Panel>
                                        <Panel disabled showArrow={false}  header="服务设置" key="3" >
                                                <NetserverformIN store={this.store} wrappedComponentRef={(inst) => this.Netserverformbkj = inst}/>
                                        </Panel>
                                        </Collapse>
                                    </div>                                    

                                </TabPane>
                                <TabPane tab="系统参数" key="3" forceRender={true}>
                                      <div id="livecontent" className="overflowdiv" style={{backgroundColor:"#FFF",padding:" 17px 19px"}}>
                                        <Collapse bordered={false}   defaultActiveKey={['1','2','3']}>
                                            <Panel disabled showArrow={false} header="系统参数" key="1" >
                                                <SysbasicFormIN  store={this.store}  wrappedComponentRef={(inst) => this.SysbasicFormbkj = inst}/>

                                            </Panel>
                                            <Panel disabled showArrow={false}  header="AgentTrap设置" key="2" >
                                                 <Systraptable store={this.store} ref="Systraptablebkj"/>  
                                            </Panel>
                                        </Collapse>
                                    </div>

                                </TabPane>
                            </Tabs>
                        </div>
                        <div style={{height: "100%", width: "20%", float: "left",borderLeft: "1px solid rgb(233, 233, 233)"}}>
                             <div className="topbar">
                                        <div style={{fontSize: "14px",paddingTop: "7px"}}>设备日志</div>
                            </div>


                                <div className="leftcontent"style={{height: window.innerHeight-64-48}} > 
                               
                                <div className="logWrapper">
                                    <h2 className="titleBar">
                                        2018-03-19
                                    </h2>
                                    <div className="logitem">
                                        <div className="logtop">
                                            <span className="logdate">
                                                23:59:59
                                            </span>
                                            <span className="logname">
                                                系统
                                            </span>
                                        </div>
                                        <p className="logcontent">
                                            修改音柱参数『21213123』213
                                        </p>
                                    </div>
                                    <div className="logitem">
                                        <div className="logtop">
                                            <span className="logdate">
                                                21:59:59
                                            </span>
                                            <span className="logname">
                                                系统
                                            </span>
                                        </div>
                                        <p className="logcontent">
                                            修改音柱参数『2123123』
                                        </p>
                                    </div>
                                    <div className="logitem">
                                        <div className="logtop">
                                            <span className="logdate">
                                                13:59:59
                                            </span>
                                            <span className="logname">
                                                系统
                                            </span>
                                        </div>
                                        <p className="logcontent">
                                            修改音柱参数『212123123』12
                                        </p>
                                    </div>
                                </div>


                                </div>
  
                        </div>     
                        </Spin>             
                </Modal>
                <Modal width="100%" wrapClassName="mymodalwrap" zIndex="999" visible={this.state.visiblef2} footer={null} mask={false} closable={false}>
                                {/* <Affix offsetTop={64} style={{left:"275px"}}> */}
                        <Spin size="large"  tip="加载中..." spinning={this.state.loading}>
                        <div style={{height: "100%", width: "80%", float: "left"}}>
                     
                                <div className="topbar">
                                <Button
                                        type="primary"
                                        icon="save"
                                        style={{marginRight:"10px",float:"right"}}
                                        onClick={this.savebutton2.bind(this)}
                                    >
                                        保 存
                                    </Button>
                                    
                                <Button
                                        icon="rollback"
                                        style={{marginRight:"10px",float:"right"}}
                                        onClick={this.backbutton.bind(this,"f2")}
                                    >
                                        返 回
                                    </Button>
                                    <Button
                                        icon="reload"
                                        style={{marginRight:"10px",float:"right"}}
                                        onClick={this.reloadbutton.bind(this)}
                                    >
                                        刷新
                                    </Button>
                                    <span className="ant-badge ant-badge-status ant-badge-not-a-wrapper" style={{margin: "2px"}}                                     
                                >
                                        {this.state.checkstate==0?    <span className="ant-badge-status-dot ant-badge-status-success" style={{width: "12px",height: "12px",position:"relative"}}>
                                                <div className="dotafter"/>
                                            </span>:<span className="ant-badge-status-dot ant-badge-status-error" style={{width: "12px",height: "12px",position:"relative"}}>
                                                <div className="dotafter-error"/>
                                            </span>}
                                            <span className="ant-badge-status-text" style={{fontSize: "16px"}}                                           
                                                 >
                                               {this.state.checkname}
                                            </span>
                                        </span>
                                </div>
                            {/* </Affix> */}
                            <Tabs tabPosition="top" id="mytab" animated={true} >
                                <TabPane tab="基本信息" key="1" forceRender={true}>                           
                                    <div id="livecontent" className="overflowdiv" style={{backgroundColor:"#FFF",padding:" 17px 19px"}}>
                                        <Collapse bordered={false}   defaultActiveKey={['1','2','3']}>
                                            <Panel disabled showArrow={false} header="音色通道" key="1" >
                                                    <RadchTable store={this.store} ref="RadchTableyy"/> 
                                            </Panel>
                                            <Panel disabled showArrow={false} header="通道状态" key="2" >
                                                    <CannelTable  store={this.store} ref="CannelTableyy"/>  
                                            </Panel>
                                        </Collapse>
                                    </div>
                            </TabPane>
                                <TabPane tab="网络参数" key="2" forceRender={true}>
                                    <div id="livecontent" className="overflowdiv" style={{backgroundColor:"#FFF",padding:" 17px 19px"}}>
                                        <Collapse bordered={false}   defaultActiveKey={['1','2','3']}>
                                        <Panel disabled showArrow={false} header="本地设置" key="1" >
                                        <NetbasicformIN store={this.store} wrappedComponentRef={(inst) => this.Netbasicformyy = inst}/>
                                        </Panel>
                                        <Panel disabled showArrow={false} header="设备信息" key="2" >
                                                <NetsoftinfoIN store={this.store}/>
                                        </Panel>
                                        <Panel disabled showArrow={false}  header="服务设置" key="3" >
                                                <NetserverformIN store={this.store} wrappedComponentRef={(inst) => this.Netserverformyy = inst}/>
                                        </Panel>
                                        </Collapse>
                                    </div>                                    

                                </TabPane>
                                <TabPane tab="系统参数" key="3" forceRender={true}>
                                      <div id="livecontent" className="overflowdiv" style={{backgroundColor:"#FFF",padding:" 17px 19px"}}>
                                        <Collapse bordered={false}   defaultActiveKey={['1','2','3']}>
                                            <Panel disabled showArrow={false} header="系统参数" key="1" >
                                                <SysbasicFormIN  store={this.store}  wrappedComponentRef={(inst) => this.SysbasicFormyy = inst}/>

                                            </Panel>
                                            <Panel disabled showArrow={false}  header="AgentTrap设置" key="2" >
                                                 <Systraptableyy store={this.store} ref="Systraptableyy"/>  
                                            </Panel>
                                        </Collapse>
                                    </div>

                                </TabPane>
                            </Tabs>
                        </div>
                        <div style={{height: "100%", width: "20%", float: "left",borderLeft: "1px solid rgb(233, 233, 233)"}}>
                             <div className="topbar">
                                        <div style={{fontSize: "14px",paddingTop: "7px"}}>设备日志</div>
                            </div>


                                <div className="leftcontent"style={{height: window.innerHeight-112}} > 
                               
                                <div className="logWrapper">
                                    <h2 className="titleBar">
                                        2018-03-19
                                    </h2>
                                    <div className="logitem">
                                        <div className="logtop">
                                            <span className="logdate">
                                                23:59:59
                                            </span>
                                            <span className="logname">
                                                系统
                                            </span>
                                        </div>
                                        <p className="logcontent">
                                            修改音柱参数『21213123』213
                                        </p>
                                    </div>
                                    <div className="logitem">
                                        <div className="logtop">
                                            <span className="logdate">
                                                21:59:59
                                            </span>
                                            <span className="logname">
                                                系统
                                            </span>
                                        </div>
                                        <p className="logcontent">
                                            修改音柱参数『2123123』
                                        </p>
                                    </div>
                                    <div className="logitem">
                                        <div className="logtop">
                                            <span className="logdate">
                                                13:59:59
                                            </span>
                                            <span className="logname">
                                                系统
                                            </span>
                                        </div>
                                        <p className="logcontent">
                                            修改音柱参数『212123123』12
                                        </p>
                                    </div>
                                </div>


                                </div>
  
                        </div>     
                        </Spin>             
                </Modal>
                <style>{`
                .ant-tabs-bar{
                    margin-bottom:0
                }
                     .aligncenter{
                        text-align: center;
                     }   
                    .ant-tabs-vertical.ant-tabs-left > .ant-tabs-content {
                        padding-left: 0;
                    }
                    .dotafter{
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                        border: 1px solid #00a854;
                        content: '';
                        -webkit-animation: antStatusProcessing 1.2s infinite ease-in-out;
                        animation: antStatusProcessing 1.2s infinite ease-in-out;

                    }
                    .dotafter-error{
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                        border: 1px solid #f04134;
                        content: '';
                        -webkit-animation: antStatusProcessing 1.2s infinite ease-in-out;
                        animation: antStatusProcessing 1.2s infinite ease-in-out;

                    }
  
                    .titleBar{
                        font-size: 14px;
                        color: #000;
                        margin-bottom: 4px;
                        font-weight: 500;
                    }
                    .logitem{
                        padding-left: 8px;
                        border-bottom: 1px dashed #d9d9d9;
                        margin-bottom: 8px;
                        min-height: 60px;
                    }  
                    .logtop{
                        color: #999;
                        margin-bottom: 4px;
                    }
                    .logdate{
                        width: 60%;
                        white-space: nowrap;
                        display: inline-block;
                    } 
                    .logname{
                        text-align: right;
                        display: inline-block;
                         width: 40%;
                    }
                    .logcontent{
                        padding-bottom: 10px;
                    }
                    .leftcontent{
                        width: 100%;
                        height: 100%;
                        padding: 16px 16px;
                       
                        overflow: auto;
                        padding-bottom: 100px;
                    }

                    .ant-modal-content {
                        -webkit-box-shadow: none;
                        box-shadow: none;
                    }
                    .mymodalwrap{
                        top:-35px;
                        left:277px;
                        background-color: #fff;
                        overflow: hidden;
                    }
                    .ant-modal-body{
                        padding:0;
                    }
                    .topbar{
                padding-top: 10px;
                padding-left: 16px;
                padding-right: 16px;
                padding-bottom: 10px;
                background-color: aliceblue;
             }

            #livecontent  .ant-collapse-header{
                 cursor:default;
                 color:#000;
                 background-color: #f7f7f7;
             }
             .overflowdiv{
                 overflow-y:auto;
                 height:${window.innerHeight-149}px
             }
             .overflowdiv::-webkit-scrollbar {
                width: 6px;
                background-color: #fff;
            }

            .overflowdiv::-webkit-scrollbar-thumb {
                background-color: rgba(70, 68, 68, 0.17);
            }
            .overflowdiv::-webkit-scrollbar-track {
                -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
                background-color: #fff;
            }
                        `}</style>

            </Layout>

        );
    }
}

export default deviceMana;