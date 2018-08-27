import React from 'react';
import { Layout, Table, Button, Form, Input, Affix, Popover, Spin, Breadcrumb, Tabs, Icon, Select,Badge,Modal,Collapse ,message,Tag, Radio } from 'antd';
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
import { withRouter } from 'react-router'

import Mapbox from './map'

import yzimg from './img/yz.jpg';
import bkjimg from './img/bkj.png';
import yyhcimg from './img/yyhc.jpg';
import dxwgimg from './img/dxwg.jpg';
import bmkzimg from './img/bmkz.png';
import './bar.css';
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Option = Select.Option;
const Panel = Collapse.Panel;
const {  Content, Sider } = Layout;
const SysbasicFormIN = Form.create()(SysbasicForm);
const NetserverformIN = Form.create()(Netserverform);
const NetbasicformIN = Form.create()(Netbasicform);
const NetsoftinfoIN = Form.create()(Netsoftinfo);
const BasicinfoFormIN = Form.create()(BasicinfoForm);
const BasicinfoyzformIN = Form.create()(Basicinfoyzform);
const QAMformIN = Form.create()(QAMform);
const NetserveryzformIN = Form.create()(Netserveryzform);
let lastdevs=[];

const deviceMana=  withRouter(class deviceMana extends React.Component {
    constructor(props) {
        super(props);
    this.store = createStore({
        id:"",
        regionname:"",
        devicesList:[],
        deviceDATA:[],
        manalogicaddr:[]
      });
    }
    state = {
        sourcedata: [],
        loading: false,
        loadingtree:false,
        visiblef1:false,
        visiblef2:false,
        visiblef3:false,
        visiblef4:false,
        visiblef5:false,
        regionname:"",
        devicesList:[],
        deviceTabledata:[],
        checkname:"",
        checkid:"",
        checkstate:"",
        switchmode:"list",
        filterDropdownVisible: false,
        searchText: '',
        filtered: false,
        bardata:{
            total:0,
            yz:0,
            bkj:0,
            wg:0
        }
    };

    cutstr(str,len)
    {
        var a;
       var str_length = 0;
       var str_len = 0,
          str_cut = "",
          str_len = str.length;
          for(var i = 0;i<str_len;i++)
         {
            a = str.charAt(i);
            str_length++;
            if(escape(a).length > 4)
            {
             //中文字符的长度经编码之后大于4
             str_length++;
             }
             str_cut = str_cut.concat(a);
             if(str_length>len)
             {
             str_cut = str_cut.concat("...");
             return str_cut;
             }
        }
        //如果给定字符串小于指定长度，则返回源字符串；
        if(str_length<=len){
         return  str;
        }
    }
    onSearch = () => {
        const { searchText ,devicesList} = this.state;
        const reg = new RegExp(searchText, 'gi');
        let deviceTabledata = this.renderdeviceTable(devicesList);        
        this.setState({
          filterDropdownVisible: false,
          filtered: !!searchText,
          deviceTabledata: deviceTabledata.map((record) => {
            const match = record.desc.match(reg);
            if (!match) {
              return null;
            }
            return {
              ...record,
              desc: (
                <span>
                  {record.desc.split(reg).map((text, i) => (
                    i > 0 ? [<span className="highlight">{match[0]}</span>, text] : text
                  ))}
                </span>
              ),
            };
          }).filter(record => !!record),
        });
      }
    onInputChange = (e) => {
        this.setState({ searchText: e.target.value });
      }

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
        if(Netbasicform==="error"){
            message.error("请输入正确的数据格式！")
            return ;
        }
        let Netserverform =this.Netserverformyy.subDATA();
        if(Netserverform==="error"){
            message.error("请输入正确的数据格式！")
            return ;
        }
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
        let Netbasicform =this.Netbasicformyz.subDATA();
        if(Netbasicform==="error"){
            message.error("请输入正确的数据格式！")
            return ;
        }
        let Netserveryzformyz =this.Netserveryzformyz.subDATA();
        if(Netserveryzformyz==="error"){
            message.error("请输入正确的数据格式！")
            return ;
        }
        let Basicinfoyzformyz =this.Basicinfoyzformyz.subDATA();
        let QAMformyz=this.QAMformyz.subDATA();
        // let Netserverform =this.Netserverformyz.subDATA();
        let SysbasicForm =this.SysbasicFormyz.subDATA();
        let Systraptable =this.refs.Systraptableyz.subDATA();
        if(Systraptable==="error"){
            message.error("请输入正确的数据格式！")
            return ;
        }

        let QAMtable =this.refs.QAMtableyz.subDATA();
        var obj = Object.assign(Netbasicform,Netserveryzformyz,Basicinfoyzformyz,QAMformyz, SysbasicForm);
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
    savebutton4(){
let that=this;
        const { id,deviceDATA } = this.store.getState();
        let postdata={"opt": "MfyValue", "id":id.toString()} 
        let subs={}
       
        let Netbasicform =this.Netbasicformbmkz.subDATA();
        if(Netbasicform==="error"){
            message.error("请输入正确的数据格式！")
            return ;
        }
        let Netserverform =this.Netserverformbmkz.subDATA();
        if(Netserverform==="error"){
            message.error("请输入正确的数据格式！")
            return ;
        }
        let SysbasicForm =this.SysbasicFormbmkz.subDATA();
        let BasicinfoFormbmkz= this.BasicinfoFormbmkz.subDATA();
        let Systraptable =this.refs.Systraptablebmkz.subDATA();
        if(Systraptable==="error"){
            message.error("请输入正确的数据格式！")
            return ;
        }
        var obj = Object.assign(BasicinfoFormbmkz,Netbasicform, Netserverform, SysbasicForm);
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
    savebutton5(){
        let that=this;
        const { id,deviceDATA } = this.store.getState();
        let postdata={"opt": "MfyValue", "id":id.toString()} 
        let subs={}
       
        let Netbasicform =this.Netbasicformbkj.subDATA();
        if(Netbasicform==="error"){
            message.error("请输入正确的数据格式！")
            return ;
        }
        let Netserverform =this.Netserverformbkj.subDATA();
        if(Netserverform==="error"){
            message.error("请输入正确的数据格式！")
            return ;
        }
        let SysbasicForm =this.SysbasicFormbkj.subDATA();
        let BasicinfoFormbkj = this.BasicinfoFormbkj.subDATA();
        let Systraptable =this.refs.Systraptablebkj.subDATA();
        if(Systraptable==="error"){
            message.error("请输入正确的数据格式！")
            return ;
        }
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
        if(Netbasicform==="error"){
            message.error("请输入正确的数据格式！")
            return ;
        }
        let Netserverform =this.Netserverform.subDATA();
        if(Netserverform==="error"){
            message.error("请输入正确的数据格式！")
            return ;
        }
        let SysbasicForm =this.SysbasicForm.subDATA();
        let Systraptable =this.refs.Systraptable.subDATA();
        if(Systraptable==="error"){
            message.error("请输入正确的数据格式！")
            return ;
        }
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
           let deviceTabledata = this.renderdeviceTable(devicesList);
           let total =deviceTabledata.length;
           let online=0;
           let yzon=0,yzoff=0;
           let wgon=0,wgoff=0;
           let bkjon=0,bkjoff=0;
            for(var dd in deviceTabledata){

                if(deviceTabledata[dd].state===0){
                    online++; 
                   switch (deviceTabledata[dd].DevType) {
                    case "1":
                        yzon++;
                        break;
                    case "3":
                        wgon++;
                        break;
                    case "5":
                    bkjon++;
                        break;
                    default:
                        break;
                }
               }else{
                switch (deviceTabledata[dd].DevType) {
                    case "1":
                        yzoff++;
                        break;
                    case "3":
                         wgoff++;
                        break;
                    case "5":
                    bkjoff++;
                        break;
                    default:
                        break;
                }
               }
            }
           let bardata =this.state.bardata;
           bardata.total =parseInt(online/total*100);
           if((yzon+yzoff)!==0)
           {bardata.yz=parseInt(yzon/(yzon+yzoff)*100);}
           if((wgon+wgoff)!==0)
           {bardata.wg=parseInt(wgon/(wgon+wgoff)*100);}
           if((bkjon+bkjoff)!==0)
           {bardata.bkj=parseInt(bkjon/(bkjon+bkjoff)*100);}
            this.setState({loadingtree:false, regionname: regionname,devicesList:devicesList ,deviceTabledata:deviceTabledata,bardata:bardata});
          });
        //   setTimeout( this.setState({loading:false}),150);
    }
    

    reloadtree(){
        this.setState({loadingtree:true});
        this.refs.mytree.reload();
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
                  let  devicebroading= item.querySelectorAll(".devicebroading")
                  let lg =devicenormal.length+deviceclose.length+devicebroading.length
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
                       let  devicebroading= item.querySelectorAll(".devicebroading")
                       let lg =devicenormal.length+deviceclose.length+devicebroading.length
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
                    let  devicebroading= item.querySelectorAll(".devicebroading")
                    let lg =devicenormal.length+deviceclose.length+devicebroading.length
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
            case "4":
                [].forEach.call(document.querySelectorAll(".deviceItem"), function (item) {
                    item.setAttribute("style", "display:none")
                });
                [].forEach.call(document.querySelectorAll(".devicenull"), function (item) {
                    item.setAttribute("style", "")
                });
                [].forEach.call(document.querySelectorAll(".devicebroading"), function (item) {
                    item.setAttribute("style", "")
                });
                [].forEach.call(document.querySelectorAll(".onedeviceWrap"), function (item) {
                    let  deviceItems= item.querySelectorAll(".deviceItems")
                    let  devicenormal= item.querySelectorAll(".devicenormal")
                    let  deviceclose= item.querySelectorAll(".deviceclose")
                    let  devicebroading= item.querySelectorAll(".devicebroading")
                    let lg =devicenormal.length+deviceclose.length+devicebroading.length
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
    deviceCodeClick(type,e){
        [].forEach.call(document.querySelectorAll(".deviceCode"), function (item) {
            item.setAttribute("class", "deviceCode")
        });
        if(type=="all"){
            [].forEach.call(document.querySelectorAll(".deviceWrap"), function (item) {
                item.setAttribute("class", "deviceWrap deviceshow")
            });
        }
        else{
            [].forEach.call(document.querySelectorAll(".deviceWrap"), function (item) {
                item.setAttribute("class", "deviceWrap devicehide")
            });
            document.getElementById(type).setAttribute("class", "deviceWrap deviceshow")
        }
        e.target.setAttribute("class", "deviceCode deviceActive")
    }
    componentDidMount() {

        let that =this;

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

    devitemClick(id,name,state,type,logicaddr){
        // if(type==="f1"){
        //     this.setState({visiblef1:true})
        //     return;  
        // }
        this.store.setState({manalogicaddr:logicaddr}); 
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
            let tt=""
            let typesrc=""
            let imgstyle ={width: "21px",height: "40px"};
            let contstyle={width:"188px"};
            switch (type) {
              case "f1":
                  tt="音柱"
                  typesrc=yzimg
                  contstyle={height:"100px"};
                  break;
              case "f2":
                  tt="语音合成器"
                  typesrc=bmkzimg
                  imgstyle={    width: "53px",
                  height: "40px",
                  position: "relative",
                  right: "15px"}
                  break;
              case "f3":
                  tt="电话短信网关"
                  typesrc=bmkzimg
                  imgstyle={    width: "53px",
                  height: "40px",
                  position: "relative",
                  right: "15px"}
                  break;
              case "f4":
                  tt="编码控制器"
                  typesrc=bmkzimg
                  imgstyle={    width: "53px",
                      height: "40px",
                      position: "relative",
                      right: "15px"}
                  break;
              case "f5":
                  tt="播出控制器"
                  typesrc=bkjimg
                  imgstyle={    width: "47px",
                  height: "40px",
                  position: "relative",
                  right: "8px"}
                  break;
              default:
                  break;
          }

            const content = (
                <div className="roomContent" style={{padding: "0px 8px"}}>
                    <img src={typesrc} style={contstyle}/>
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
                        <div className="deviceItem devicenormal" style={{maxWidth:"159px"}} onClick={()=>{that.devitemClick(item.id,item.desc,item.state,type)}}>                
                        <div className="leftarea" >
                            <span >
                                {that.cutstr(item.desc,12)}
                            </span>
                            <span>
                                {tt}
                            </span>
                            <span style={{opacity:0.5}}>
                                运行正常
                            </span>
                        </div>
                        <div className="rightarea" >
                            <div style={{position: "relative",left: "7px"}}>
                            <img src={typesrc} style={imgstyle} />
                            <div className="devicestate-normal"></div>
                            </div>
                        </div>
                        </div>
                     </Popover>)
                break;
                case 4:
                return (<Popover title={<Badge status="error" text={item.desc} />}  placement="rightTop"  content={content} >
                    <div className="deviceItem deviceclose" style={{maxWidth:"159px"}} onClick={()=>{that.devitemClick(item.id,item.desc,item.state,type)}}>             
                    <div className="leftarea" >
                    <span >
                        {item.desc}
                    </span>
                    <span>
                    {tt}
                    </span>
                    <span style={{opacity:0.5}}>
                        离线
                    </span>
                </div>
                <div className="rightarea" >
                         <div style={{position: "relative",left: "7px"}}>
                    <img src={typesrc} style={imgstyle} />
                    <div className="devicestate-unnormal"></div>
                        </div>
                </div>
                    </div>
                 </Popover>)
                break;
                case 32:
                return (<Popover title={<Badge status="processing" text={item.desc} />}  placement="rightTop"  content={content} >
                    <div className="deviceItem devicebroading" style={{maxWidth:"159px"}} onClick={()=>{that.devitemClick(item.id,item.desc,item.state,type)}}>             
                    <div className="leftarea" >
                    <span >
                        {item.desc}
                    </span>
                    <span>
                    {tt}
                    </span>
                    <span style={{opacity:0.5}}>
                        播放中
                    </span>
                </div>
                <div className="rightarea" >
                         <div style={{position: "relative",left: "7px"}}>
                    <img src={typesrc} style={imgstyle} />
                    <div className="devicestate-process"></div>
                        </div>
                </div>
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


    modeChange(e){
        this.setState({switchmode:e.target.value })
    }
    renderdeviceTable(dev){
            let devdata=[];
            for(let i in dev){
                    console.log(dev[i])
                dev[i].forEach(function(i,index){
                    let indata={}

                    if(i.IsNetworkManage!=="0") {
                    for(let j in i){
                                 if(j!="children"){
                                indata[j]=i[j]
                            }
                    } 
                    devdata.push(indata)
                }
                })
            }
            return devdata;
    }

    clickreback(){
        this.props.history.replace('/AppsMana') 
    }

    renderContent(mode){
        let that =this;
        const columns = [{
            title: '设备名称',
            dataIndex: 'desc',
            filterDropdown: (
                <div className="custom-filter-dropdown">
                  <Input
                    ref={ele => this.searchInput = ele}
                    placeholder="搜索设备名称"
                    value={this.state.searchText}
                    onChange={this.onInputChange}
                    onPressEnter={this.onSearch}
                  />
                  <Button type="primary" onClick={this.onSearch}>搜索</Button>
                </div>
              ),
              filterIcon: <Icon type="search" style={{cursor: "pointer",marginLeft: "3px", color: this.state.filtered ? '#108ee9' : '#aaa' }} />,
              filterDropdownVisible: this.state.filterDropdownVisible,
              onFilterDropdownVisibleChange: (visible) => {
                this.setState({
                  filterDropdownVisible: visible,
                }, () => this.searchInput && this.searchInput.focus());
              },
            render: (text, record) => {
                let type='';
                switch (record.DevType) {
                case "1":
                    type="f1"
                        break;
                case "2":
                    type="f2"
                        break;
                case "3":
                    type="f3"
                        break;
                case "4":
                    type="f4"
                        break;
                case "5":
                    type="f5"
                        break;                
                    default:
                        break;
                }
                return (
                    <a onClick={that.devitemClick.bind(that,record.id,record.desc,record.state,type,record.logicaddr)}>{text}</a>
                );
            },
          }, {
            title: '设备类型',
            dataIndex: 'DevType',
            filters: [
                { text: '音柱', value: '1' },
                { text: '多路语音合成器', value: '2' },
                { text: '电话短信网关', value: '3' },
                { text: '数字编码控制器', value: '4' },
                { text: '播出控制器', value: '5' },
              ],
              onFilter: (value, record) => record.DevType.includes(value),
            render: (text, record) => 
            {  switch (text) {
                case "1":
                  return <Tag className="cyan">音柱</Tag>;
                  break;
                case "2":
                  return <Tag className="blue">多路语音合成器</Tag>;
                  break ;
                case "3":
                  return <Tag className="magenta">电话短信网关</Tag>;
                  break ;
                case "4":
                  return <Tag className="lime">数字编码控制器</Tag>;
                  break ;
                case "5":
                  return <Tag className="green">播出控制器</Tag>;
                  break ;
                default:
                  break;
              }
            
            }      
          }, { 
            title: '设备状态',
            dataIndex: 'state',
            filters: [
                { text: '正常', value: 0 },
                { text: '离线', value:4 },
                { text: '播放中', value:32 },
              ],
              onFilter: (value, record) => record.state.toString().includes(value.toString() ),
           
            render: (text, record) => 
        {  switch (text) {
            case 0:
              return <Badge status="success" text="正常" />;
              break;
            case 4:
              return <Badge status="error" text="离线" />;
              break ;
              case 32:
              return <Badge status="processing" text="播放中" />;
              break ;
            default:
            return text;
              break;
          }
        
        }      
          }, {
            title: '逻辑地址',
            dataIndex: 'logicaddr',
          }, {
            title: 'IP地址',
            dataIndex: 'NetManageIp',
          }];
        switch (mode) {
            case "card":
                return (<div style={{ padding: "16px 16px", backgroundColor: "#f6f9fe", display: "flex" }}>
                
                <div className="cardSider">
            <Affix offsetTop={130}>
                <div className="devicetools">
                    <a type="all" className="deviceCode deviceActive" onClick={this.deviceCodeClick.bind(this,"all")}>
                        全部 
                    </a>
                    <a type="f1" className="deviceCode" onClick={this.deviceCodeClick.bind(this,"f1")}>
                        音柱
                    </a>
                    <a type="f2" className="deviceCode" onClick={this.deviceCodeClick.bind(this,"f2")}>
                         多路语音
                    </a>
                    <a type="f3" className="deviceCode" onClick={this.deviceCodeClick.bind(this,"f3")}>
                    短信网关
                    </a>
                    <a type="f4" className="deviceCode" onClick={this.deviceCodeClick.bind(this,"f4")}>
                    数字编码
                    </a>
                    <a type="f5" className="deviceCode" onClick={this.deviceCodeClick.bind(this,"f5")}>
                    播出控制器
                    </a>
                </div>
             </Affix>
                </div>
              
                <div className="cardContent">
                    <div id="f1" className="deviceWrap">
                        <div className="onedeviceWrap" >
                            {this.renderdeviceWrap(this.state.devicesList.dev1,"f1")}      
                        </div>
                    </div>
                    <div id="f2" className="deviceWrap">

                        <div className="onedeviceWrap">
                            {this.renderdeviceWrap(this.state.devicesList.dev2,"f2")}  
                        </div>
                    </div>
                    <div id="f3" className="deviceWrap">
   
                        <div className="onedeviceWrap">
                             {this.renderdeviceWrap(this.state.devicesList.dev3,"f3")} 
                        </div>
                    </div>
                    <div id="f4" className="deviceWrap">

                        <div className="onedeviceWrap">
                        {this.renderdeviceWrap(this.state.devicesList.dev4,"f4")} 
                        </div>
                    </div>
                    <div id="f5" className="deviceWrap">
        
                        <div className="onedeviceWrap">
                        {this.renderdeviceWrap(this.state.devicesList.dev5,"f5")} 
                        </div>
                    </div>
                </div>

            </div>) 
                break;
            case "map":
                return (<div id="resizediv2" style={{height:window.innerHeight-114}}><Mapbox devitemClick={this.devitemClick.bind(this)} store={this.store}/></div>)
                break;
            case "list":
                return ( <div  style={{padding: "12px 24px"}}>
                
                <div className="liveratediv">
                    <div style={{padding:"0 34px",display:"flex"}}>
                <div className="flexy-column">
                    <div className="progresstitle">设备总在线率</div>
                    <div className="progress-factor flexy-item">
                        <div className="progress-bar">
                            <div className="bar has-rotation has-colors  cyan ruler-3 move" role="progressbar" aria-valuenow={this.state.bardata.total} aria-valuemin="0" aria-valuemax="100">
                            {this.state.bardata.total!==0?<div className="tooltip white"></div>:null}
                                <div className="bar-face face-position roof percentage"></div>
                                <div className="bar-face face-position back percentage"></div>
                                <div className="bar-face face-position floor percentage volume-lights"></div>
                                <div className="bar-face face-position left"></div>
                                <div className="bar-face face-position right"></div>
                                <div className="bar-face face-position front percentage volume-lights shine"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flexy-column">
                     <div className="progresstitle">音柱在线率</div>
                    <div className="progress-factor flexy-item">
                        <div className="progress-bar">
                            <div className="bar has-rotation has-colors yellow  move" role="progressbar" aria-valuenow={this.state.bardata.yz} aria-valuemin="0" aria-valuemax="100">
                            {this.state.bardata.yz!==0?<div className="tooltip white"></div>:null}
                                <div className="bar-face face-position roof percentage"></div>
                                <div className="bar-face face-position back percentage"></div>
                                <div className="bar-face face-position floor percentage volume-lights"></div>
                                <div className="bar-face face-position left"></div>
                                <div className="bar-face face-position right"></div>
                                <div className="bar-face face-position front percentage volume-lights shine"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flexy-column">
                     <div className="progresstitle">播出控制器在线率</div>
                    <div className="progress-factor flexy-item">
                   
                        <div className="progress-bar">
                            <div className="bar has-rotation has-colors yellow  move" role="progressbar" aria-valuenow={this.state.bardata.bkj} aria-valuemin="0" aria-valuemax="100">
                            {this.state.bardata.bkj!==0?<div className="tooltip white"></div>:null}
                                <div className="bar-face face-position roof percentage"></div>
                                <div className="bar-face face-position back percentage"></div>
                                <div className="bar-face face-position floor percentage volume-lights"></div>
                                <div className="bar-face face-position left"></div>
                                <div className="bar-face face-position right"></div>
                                <div className="bar-face face-position front percentage volume-lights shine"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flexy-column">
                     <div className="progresstitle">网关在线率</div>
                    <div className="progress-factor flexy-item">
                   
                        <div className="progress-bar">
                            <div className="bar has-rotation has-colors yellow  move" role="progressbar" aria-valuenow={this.state.bardata.wg} aria-valuemin="0" aria-valuemax="100">
                                {this.state.bardata.wg!==0?<div className="tooltip white"></div>:null}
                                <div className="bar-face face-position roof percentage"></div>
                                <div className="bar-face face-position back percentage"></div>
                                <div className="bar-face face-position floor percentage volume-lights"></div>
                                <div className="bar-face face-position left"></div>
                                <div className="bar-face face-position right"></div>
                                <div className="bar-face face-position front percentage volume-lights shine"></div>
                            </div>
                        </div>
                    </div>
                </div>
                     </div>
                </div>
                <Table pagination={{pageSize: 15, showSizeChanger: true, showQuickJumper: true}}  columns={columns}  dataSource={this.state.deviceTabledata} size="small"/> 
                </div> )
                break;
            default:
                break;
        }
    }


    render() {
        let that= this;
        const data = [
            // {
            //   title: 'Ant Design Title 1',
            // },
            // {
            //   title: 'Ant Design Title 2',
            // },
            // {
            //   title: 'Ant Design Title 3',
            // },
            // {
            //   title: 'Ant Design Title 4',
            // },
          ];
         
        return (
            <Layout >
                {/* <Sider id="myregiontreediv" width={275} style={{ height: window.innerHeight - 64, background: '#fff', boxShadow: "1px 0px 6px #dcd0d0", overflow: 'auto', position: 'fixed', left: this.props.mleft}}> */}
                <Sider id="myregiontreediv" width={275} style={{ height: window.innerHeight - 64, background: 'rgb(47, 70, 89)', boxShadow: "1px 0px 6px #dcd0d0", overflow: 'auto', position: 'fixed', left: 0}}>
                    <RegionTree store={this.store} ref="mytree"/>
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
                                    
                     { this.state.switchmode=="card"?<Tabs onChange={this.tabchange.bind(this)} type="card" style={{ position: "absolute", left: "32%", top: "18px" }}>
                                        <TabPane tab={<span><Icon type="laptop" />全部 </span>} key="1"></TabPane>
                                        <TabPane tab={<span><Icon type="check" />正常 </span>} key="2"></TabPane>
                                        {/* <TabPane tab={<span><Icon type="exclamation" />异常 8</span>} key="3"></TabPane> */}
                                        <TabPane tab={<span><Icon type="link" />离线</span>} key="3"></TabPane>
                                        <TabPane tab={<span><Icon  type="notification" />播放中</span>} key="4"></TabPane>
                                    </Tabs>:null}
                                    <span>    <Button shape="circle" icon="reload" loading={this.state.loadingtree}  onClick={this.reloadtree.bind(this)}   style={{marginRight:"10px"}}/>

                                        <Radio.Group value={this.state.switchmode} onChange={this.modeChange.bind(this)}>
                                            <Radio.Button value="list">列表模式</Radio.Button>
                                            <Radio.Button value="card">卡片模式</Radio.Button>
                                            <Radio.Button value="map">地图模式</Radio.Button>
                                          
                                        </Radio.Group>
                                        {/* <Select defaultValue="card" type="primary" onChange={this.modeChange.bind(this)}>
                                            <Option value="card">卡片模式</Option>
                                            <Option value="list">列表模式</Option>
                                        </Select> */}
                                        {/* <Button  style={{marginLeft:"10px"}}  icon="left"   type="primary" onClick={this.clickreback.bind(this)} >返回</Button> */}
                                    </span>
                                </div>
                            </Affix>
                        {this.renderContent(this.state.switchmode)}
           
                        </div>
                    </Content>
                </Layout>
                <Modal width="100%" wrapClassName="mymodalwrap" zIndex="999" visible={this.state.visiblef3} footer={null} mask={false} closable={false}>
                  
                        <div style={{height: "100%", width: "80%", float: "left"}}>
                                <div className="topbar">
                                <Button
                                        type="primary"
                                        icon="save"
                                        style={{marginRight:"10px",float:"right"}}
                                        onClick={this.savebutton3.bind(this)}
                                        disabled={this.state.loading}
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
                                        disabled={this.state.loading}
                                    >
                                        刷 新
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
                            <Spin size="large"  tip="加载中..." spinning={this.state.loading}>
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
                              </Spin>  
                        </div>
                        <div style={{height: "100%", width: "20%", float: "left",borderLeft: "1px solid rgb(233, 233, 233)"}}>
                             <div className="topbar">
                                        <div style={{fontSize: "14px",paddingTop: "7px"}}>设备日志</div>
                            </div>


                                <div className="leftcontent"style={{height: window.innerHeight-64-48}} > 
{/*                                
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
                                </div> */}


                                </div>
  
                        </div>  
                                 
                </Modal>
                <Modal width="100%" wrapClassName="mymodalwrap" zIndex="999" visible={this.state.visiblef1} footer={null} mask={false} closable={false}>
                                {/* <Affix offsetTop={64} style={{left:"275px"}}> */}
                      
                        <div style={{height: "100%", width: "80%", float: "left"}}>
                     
                                <div className="topbar">
                                <Button
                                        type="primary"
                                        icon="save"
                                        style={{marginRight:"10px",float:"right"}}
                                        onClick={this.savebutton1.bind(this)}
                                        disabled={this.state.loading}
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
                                        disabled={this.state.loading}
                                    >
                                        刷 新
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
                                <Spin size="large"  tip="加载中..." spinning={this.state.loading}>
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
                            </Tabs>  </Spin>   
                        </div>
                        <div style={{height: "100%", width: "20%", float: "left",borderLeft: "1px solid rgb(233, 233, 233)"}}>
                             <div className="topbar">
                                        <div style={{fontSize: "14px",paddingTop: "7px"}}>设备日志</div>
                            </div>


                                <div className="leftcontent"style={{height: window.innerHeight-64-48}} > 
                               
                              


                                </div>
  
                        </div>     
                                
                </Modal>
                <Modal width="100%" wrapClassName="mymodalwrap" zIndex="999" visible={this.state.visiblef5} footer={null} mask={false} closable={false}>
                                {/* <Affix offsetTop={64} style={{left:"275px"}}> */}
                        
                        <div style={{height: "100%", width: "80%", float: "left"}}>
                     
                                <div className="topbar">
                                <Button
                                        type="primary"
                                        icon="save"
                                        style={{marginRight:"10px",float:"right"}}
                                        onClick={this.savebutton5.bind(this)}
                                        disabled={this.state.loading}
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
                                        disabled={this.state.loading}
                                    > 
                                        刷 新
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
                                <Spin size="large"  tip="加载中..." spinning={this.state.loading}>
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
                            </Tabs>   </Spin>         
                        </div>
                        <div style={{height: "100%", width: "20%", float: "left",borderLeft: "1px solid rgb(233, 233, 233)"}}>
                             <div className="topbar">
                                        <div style={{fontSize: "14px",paddingTop: "7px"}}>设备日志</div>
                            </div>


                                <div className="leftcontent"style={{height: window.innerHeight-64-48}} > 
                               
                              

                                </div>
  
                        </div>     
                         
                </Modal>
                <Modal width="100%" wrapClassName="mymodalwrap" zIndex="999" visible={this.state.visiblef2} footer={null} mask={false} closable={false}>
                                {/* <Affix offsetTop={64} style={{left:"275px"}}> */}
                 
                        <div style={{height: "100%", width: "80%", float: "left"}}>
                     
                                <div className="topbar">
                                <Button
                                        type="primary"
                                        icon="save"
                                        style={{marginRight:"10px",float:"right"}}
                                        onClick={this.savebutton2.bind(this)}
                                        disabled={this.state.loading}
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
                                        disabled={this.state.loading}
                                    >
                                        刷 新
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
                            <Spin size="large"  tip="加载中..." spinning={this.state.loading}>
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
                            </Tabs>  </Spin>   
                        </div>
                        <div style={{height: "100%", width: "20%", float: "left",borderLeft: "1px solid rgb(233, 233, 233)"}}>
                             <div className="topbar">
                                        <div style={{fontSize: "14px",paddingTop: "7px"}}>设备日志</div>
                            </div>


                                <div className="leftcontent"style={{height: window.innerHeight-112}} > 
                               
                             

                                </div>
  
                        </div>     
                                
                </Modal>

                <Modal width="100%" wrapClassName="mymodalwrap" zIndex="999" visible={this.state.visiblef4} footer={null} mask={false} closable={false}>
                                {/* <Affix offsetTop={64} style={{left:"275px"}}> */}
                        <div style={{height: "100%", width: "80%", float: "left"}}>
                     
                                <div className="topbar">
                                <Button
                                        type="primary"
                                        icon="save"
                                        style={{marginRight:"10px",float:"right"}}
                                        onClick={this.savebutton4.bind(this)}
                                        disabled={this.state.loading}
                                    >
                                        保 存
                                    </Button>
                                    
                                <Button
                                        icon="rollback"
                                        style={{marginRight:"10px",float:"right"}}
                                        onClick={this.backbutton.bind(this,"f4")}
                                    >
                                        返 回
                                    </Button>
                                    <Button
                                        icon="reload"
                                        style={{marginRight:"10px",float:"right"}}
                                        onClick={this.reloadbutton.bind(this)}
                                        disabled={this.state.loading}
                                    >
                                        刷 新
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
                            <Spin size="large"  tip="加载中..." spinning={this.state.loading}>
                            <Tabs tabPosition="top" id="mytab" animated={true} >
                                <TabPane tab="基本信息" key="1" forceRender={true}>                           
                                    <div id="livecontent"  className="overflowdiv" style={{backgroundColor:"#FFF",padding:" 17px 19px"}}>
                                        <Collapse bordered={false}   defaultActiveKey={['1','2','3']}>
                                            <Panel disabled showArrow={false} header="基本信息" key="1" >
                                                <BasicinfoFormIN store={this.store} wrappedComponentRef={(inst) => this.BasicinfoFormbmkz = inst}/>
                            
                                            </Panel>
                                        </Collapse>
                                    </div>
                            </TabPane>
                                <TabPane tab="网络参数" key="2" forceRender={true}>
                                    <div id="livecontent" className="overflowdiv" style={{backgroundColor:"#FFF",padding:" 17px 19px"}}>
                                        <Collapse bordered={false}   defaultActiveKey={['1','2','3']}>
                                        <Panel disabled showArrow={false} header="本地设置" key="1" >
                                        <NetbasicformIN store={this.store} wrappedComponentRef={(inst) => this.Netbasicformbmkz = inst}/>
                                        </Panel>
                                        <Panel disabled showArrow={false} header="设备信息" key="2" >
                                                <NetsoftinfoIN store={this.store}/>
                                        </Panel>
                                        <Panel disabled showArrow={false}  header="服务设置" key="3" >
                                                <NetserverformIN store={this.store} wrappedComponentRef={(inst) => this.Netserverformbmkz= inst}/>
                                        </Panel>
                                        </Collapse>
                                    </div>                                    

                                </TabPane>
                                <TabPane tab="系统参数" key="3" forceRender={true}>
                                      <div id="livecontent" className="overflowdiv" style={{backgroundColor:"#FFF",padding:" 17px 19px"}}>
                                        <Collapse bordered={false}   defaultActiveKey={['1','2','3']}>
                                            <Panel disabled showArrow={false} header="系统参数" key="1" >
                                                <SysbasicFormIN  store={this.store}  wrappedComponentRef={(inst) => this.SysbasicFormbmkz = inst}/>

                                            </Panel>
                                            <Panel disabled showArrow={false}  header="AgentTrap设置" key="2" >
                                                 <Systraptable store={this.store} ref="Systraptablebmkz"/>  
                                            </Panel>
                                        </Collapse>
                                    </div>

                                </TabPane>
                            </Tabs></Spin> 
                        </div>
                        <div style={{height: "100%", width: "20%", float: "left",borderLeft: "1px solid rgb(233, 233, 233)"}}>
                             <div className="topbar">
                                        <div style={{fontSize: "14px",paddingTop: "7px"}}>设备日志</div>
                            </div>


                                <div className="leftcontent"style={{height: window.innerHeight-64-48}} > 
                               
                               


                                </div>
  
                        </div>     
                                    
                </Modal>

                <style>{`
                 .ant-tree-title {
                        font-size: 14px;
                    }
                    .ant-tree-node-selected .ant-tree-title, .ant-tree-node-selected:hover .ant-tree-title {
                        color: #fff;
                    }
                     .ant-tree-switcher,  .ant-tree-title {
                        color: #7ba0bb;
                    }
                    .ant-tree-node-selected, .ant-tree-node-selected:hover {
                    background-color: #1c2a36 !important;
                }
                .ant-tree-node-content-wrapper:hover {
                    background-color: #1c2a36 !important;
                }
                .ant-tree-node-content-wrapper:hover .ant-tree-title {
                        color: #fff;
                    }
                    `}</style>



                <style>{`
                .leftarea{
                    float: left;
                        width: 65%;
                        display: flex;
                        flex-direction: column;
                }
                .rightarea{
                    float: left;
                        width:35%;
                        display: flex;
                        flex-direction: column;
                }
                .devicestate-normal{
                    background-color: #23f18a;
                            width: 13px;
                            height: 4px;
                            border-radius:  10px;
                            margin-top:  5px;
                            margin-left: 3px;
                }

                .devicestate-unnormal{
                    background-color: red;
                            width: 13px;
                            height: 4px;
                            border-radius:  10px;
                            margin-top:  5px;
                            margin-left: 3px;
                }
                .devicestate-process{
                    background-color: #108ee9;
                            width: 13px;
                            height: 4px;
                            border-radius:  10px;
                            margin-top:  5px;
                            margin-left: 3px;
                }
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
                        left:275px;
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

            .devicetools{
                padding:10px;
                background: #fff;
                overflow: hidden;
                border-radius: 2px;
                box-shadow: 0 1px 3px rgba(26,26,26,.1);
                box-sizing: border-box;
            }

            .custom-filter-dropdown {
  padding: 8px;
  border-radius: 6px;
  background: #fff;
  box-shadow: 0 1px 6px rgba(0, 0, 0, .2);
}

.custom-filter-dropdown input {
  width: 130px;
  margin-right: 8px;
}

.highlight {
  color: #f50;
}
.liveratediv{
    height: 160px;
    border: 1px solid #e9e9e9;
    border-radius: 6px;
    margin-bottom: 12px;
    color: #444;
    background: #E5E8EF;
}
.flexy-column{
    margin-right: 15px;
    margin-left: 10px;
}
.progresstitle{
    padding:10px;
}

                        `}</style>


<style>{`


    
    
    
    `}</style>



            </Layout>

        );
    }
}
);
export default deviceMana;