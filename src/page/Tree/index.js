import React from 'react';
import area1 from './3.png';
import area2 from './4.png';
import { Layout ,Tree, Input,Menu, Form,Button,Icon,Table,Modal,Affix,Switch,Select,Tag,Progress,Tooltip} from 'antd';
import XLSX from 'xlsx';
import {netdata} from './../../helper'
import { withRouter } from 'react-router'
import _ from 'underscore'
import createStore from '../createStore';
import Notification from 'antd/lib/notification'
//import Logicinput from './LogicAddrInput'
import Mapbox from './map'

const InputGroup = Input.Group;
const TreeNode = Tree.TreeNode;
const { Sider, Content } = Layout;
const FormItem = Form.Item;
const Option = Select.Option;
let wb;
let rABS = false; //是否将文件读取为二进制字符串
let tmpDown;
let dData = [];
let rightselectnode = null;
let selectnode = null;
let selectdatanode = null;
let Data = [];
let localexpandedKeysSet=null
export default withRouter(  class extends React.Component {

  constructor(props) {
    super(props);
    this.store = createStore({
      id:"",
      devicedata:[]
    });
    this.store1 = createStore({
      latlng: [],
    });
    this.state = {
      loading: false,
      regiondata:[],
      devicedata:[],
      selectedRowKeys: [],
      Data:[],
      visRegForm:false,
      confirmLoading: false,
      // phyaddrarr:["","","","","",""],
      // phyaddrarredit:["","","","","",""],
      logicaddrarr:["","","","","",""],
      logicaddrarr1:["","","","","",""],
      logicaddrarredit:["","","","","",""],
      logicaddrarredit1:["","","","","",""],
      logicaddrwritable:[false,false,false,false,false,false],
      FormTitle:"",
      MapsetVisable:false,
      MapRowId:'',
      modifyName:'',
      modifyNameedit:'',
      snmpcom:'',
      ipaddredit:'',
      ipaddr:'',
      ReadStredit:'public',
      ReadStr:'public',
      WriteStredit:'private',
      WriteStr:'private',
      SnmpVeredit:'2',
      SnmpVer:'2',
      DevType:"2",
      DevTypeedit:"",
      ensnmpedit:true,
      ensnmp:true,
      selectedKeysSet:[],
      showDevAdd:false,
      showDevAdd2:false,
      serachTxt:'',
      Addshowlogi:true,
      Addshowlogiedit:true,
      editvisable:false,
      regiontag:true,
      modifyTag:true,
      yzaddVisable:false,
      yzaddsheetdata:[],
      percent:[],
      percenttooltip:[],
      percentstatus:[],
      downloadname:"未命名",
      ManaAuth:[true,true,true,true,true,true],
      addcancel:true
    }
  }
  isValidIP(ip) {
    var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
    return reg.test(ip);
} 
  authInit(Authtype){
    for(let i=0;i<Authtype.length;i++){
      if(Authtype[i]=='1'||Authtype[i]=='-1'){
        return;
      }
    }
    let tag=[false,false,false,false,false,false]
    for(let i=0;i<Authtype.length;i++){
      if(Authtype[i]=='2'){
        tag[0]=true;
      }else if(Authtype[i]=='3'){
        tag[1]=true;
      }
      else if(Authtype[i]=='4'){
        tag[2]=true;
      }
      else if(Authtype[i]=='5'){
        tag[3]=true;
      }

      else if(Authtype[i]=='6'){
        tag[4]=true;
      }
      else if(Authtype[i]=='7'){
        tag[5]=true;
      }
    }
    this.setState({ManaAuth:tag})
  }




  componentWillMount(){  
    let Authtype=localStorage.Auth.split(',');
     if(localStorage.UserID!=-1)
     {this.authInit(Authtype);}
    //  if (havedata) {
    //   return;
    // }
    // havedata = true;
    _.delay(this.update.bind(this), 10)  
       localexpandedKeysSet= localStorage.expandedKeysSet.split(',');
    this.setState({selectedKeysSet:localStorage.selectedKeysSet.split(',')})
  }


  componentWillUnmount () {  
    window.onresize= function(){}
  }

  componentDidMount () {

    window.onresize = function(){
      var height = (window.innerHeight - 64) + "px";

      try {
        document.getElementById('mysider').style.height = height;
      } catch (error) {

      }
    };


    // this.store.subscribe(() => {
    //   const { latlng } = this.store.getState();
    //   console.log("checkedKeystore____tree",latlng)
    //   this.setState({ latlng: latlng });
    // });
    selectdatanode = null
    if(this.state.selectedKeysSet[0]!=""){
       this.SearchRegion(this.state.selectedKeysSet, Data[0])
    }
   
    if(selectdatanode != null){
      this.getDevice(selectdatanode)
    }
    this.setState({devicedata:dData})
  }

  update() {
    this.setState({loading: true})
    let r = {
      method: "POST",
      body: JSON.stringify({"opt":"getTree"})
    }
    netdata('/topoly/regionTreeOpt.epy', r).then(this.ondata.bind(this))
  }

  ondata(res) {
    if(res.d.errCode === "Cookie过期"){
      this.props.history.replace('/power')
    }
    let sd = {loading: false}
    if(res.d.errCode === 0){
      Data = res.d.Values;
      this.setState({visRegForm:false})
    }
    else{
       Notification['error']({
        message: '数据请求错误',
        description: JSON.stringify(res.d.errCode),
      });
    }
    //gData = generateData();
    try {
          dData = []
        this.CreatDevData("")
        sd.Data = Data;
        sd.devicedata = dData;
        sd.confirmLoading =false;
        sd.selectedRowKeys = []
        this.setState(sd)
    } catch (error) {
      
    }

  }

  CreatDevData(filterName){
    if(selectnode == null)
      return
    selectdatanode = null
    this.SearchRegion(selectnode.props.dataRef['id'], Data[0])
    if(selectdatanode != null){
      this.getDevice(selectdatanode,filterName)
    }
  }

  SearchRegion(id, data){
    if(data.id === id){
      selectdatanode = data
      return
    }
    else{
      if(data.eocT !== 1){
        data.children.map((item)=>{
          this.SearchRegion(id, item)
        })      
      }
    }
  }
  isContains(str, substr) {
    return new RegExp(substr).test(str);
  }
 

  getDevice(node,filterName){
    node.children.map((item)=>{
      if(item.eocT === 1){
        item.children = "";
        if(this.isContains(item.desc,filterName)||filterName===""){
          dData.push(item)
        }
        
      }
      else{
        this.getDevice(item,filterName)
      }
    })
  }

  filterDev(value){
    dData = [];
    this.CreatDevData(value);
    this.setState({devicedata:dData})
  }

  /*ondevicedata(res){
    console.log("DeviceData:")
    console.log(res);
    let sd = {loading: false}
    if (res.s === false) {
      Notification['error']({
        message: '数据请求错误',
        description: JSON.stringify(res.d),
      });
      this.setState(sd)
      return;
    }
    if(res.d.errCode === 0){
      dData = res.d.Values;
    }
    else{

    }
    sd.devicedata = dData;
    sd.confirmLoading =false;
    sd.selectedRowKeys = []
    this.setState(sd)
  }*/

  renderTreeNodes = (data) => {
    if(data.length === 0)
      return <TreeNode title="路通应急广播管理系统"/>;
    return data.map((item) => {
      var Png = ""
      let haveregionchild = false
      if(item.eocT === -1)
        Png = area1
      else if(item.eocT === 0)
        Png = area2
      if(item.children!=""){
        item.children.map(item=>{
          if(item.eocT === 0){
            haveregionchild = true;
          }
        })
      }

      if (haveregionchild) {
        if(item.eocT === -1){
          return(
            <TreeNode title={<span><img src={Png}  style={{height:'14px',marginRight:"5px"}} />{item.desc}</span>} key={item.id} dataRef={item}>
              {this.renderTreeNodes(item.children)}
            </TreeNode>
          );
        }
        else{
          return (
            <TreeNode title={<span><img src={Png}  style={{height:'14px',marginRight:"5px"}} />{item.desc}({item.logicaddr})</span>} key={item.id} dataRef={item}>
              {this.renderTreeNodes(item.children)}
            </TreeNode>
          );
        }
      }
      else{
        if(item.eocT === 0)
          return <TreeNode title={<span><img src={Png}  style={{height:'14px',marginRight:"5px"}} />{item.desc}({item.logicaddr})</span>} key={item.id} dataRef={item}/>
      }
    });
  }

  onRightClick = (info)=>{
    // if(localStorage.UserName ==="超级管理员"){  
    let addTAG=true;
    let deleteTag=true;

    console.log(info.node.props.dataRef['logicaddr'].substring(9,12),info.node.props.dataRef['logicaddr'].substring(12,14))
    if(info.node.props.dataRef['IsAuth']===0){
      if(info.node.props.dataRef['logicaddr'].substring(9,12)!="000"&&info.node.props.dataRef['logicaddr'].substring(12,14)=="00"){
        addTAG=false;
      }

    this.setState({
      rightClickNodeTreeItem: {
        pageX: info.event.pageX,
        pageY: info.event.pageY,
        id: info.node.props.dataRef['id'],
        nodetype: info.node.props.dataRef['eocT'],
        categoryName: info.node.props.dataRef['desc'],
         addTAG:addTAG,
         deleteTag:false,
         modifyTag:false
      }
    });
    rightselectnode = info.node;
  } 
  else if(info.node.props.dataRef['IsAuth']===1){
      if(info.node.props.dataRef['logicaddr'].substring(9,12)!="000"&&info.node.props.dataRef['logicaddr'].substring(12,14)=="00"){
        addTAG=false;
      }
    this.setState({
      rightClickNodeTreeItem: {
        pageX: info.event.pageX,
        pageY: info.event.pageY,
        id: info.node.props.dataRef['id'],
        nodetype: info.node.props.dataRef['eocT'],
        categoryName: info.node.props.dataRef['desc'],
         addTAG:addTAG,
         deleteTag:true,
         modifyTag:true
      }
    });
    rightselectnode = info.node;
  }
  else if(info.node.props.dataRef['IsAuth']===2){



  }
//  }
  }

  onTreeClick = (info, event)=>{

  if(event.node.props.dataRef['IsAuth']===1){
    this.setState({showDevAdd2:true})
      if(event.node.props.dataRef['logicaddr'].substring(9,12)!="000"&&event.node.props.dataRef['logicaddr'].substring(12,14)=="00"){
      this.setState({showDevAdd:true})

    }
    else{
      this.setState({showDevAdd:false})
    }

  }
  else if(event.node.props.dataRef['IsAuth']===2){
    this.setState({showDevAdd2:false})
    this.setState({showDevAdd:false})

  }
  else if(event.node.props.dataRef['IsAuth']===0){
    this.setState({showDevAdd2:true})
    if(event.node.props.dataRef['logicaddr'].substring(9,12)!="000"&&event.node.props.dataRef['logicaddr'].substring(12,14)=="00"){
      this.setState({showDevAdd:true})

    }
    else{
      this.setState({showDevAdd:false})
    }
  }
    if(info.length === 0){
      return
    }
    localStorage.selectedKeysSet =info;
    this.setState({selectedKeysSet:info})
    selectnode = event.node;
    dData = []
    this.CreatDevData("");
    this.setState({devicedata:dData,serachTxt:"",downloadname:event.node.props.dataRef["desc"]+event.node.props.dataRef["logicaddr"]})
  }



  handleChange(event) {
    // serachTxt = event.target.value;
    this.setState({serachTxt: event.target.value});
  }
  onExpand = (expandedKeys) => {
    localStorage.expandedKeysSet =expandedKeys;
  }
  onSelectChange = (selectedRowKeys) => {
    //console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  }

  handleClick = (info)=>{
    this.setState({rightClickNodeTreeItem:null});
  }

  getNodeTreeRightClickMenu() {
    const {pageX, pageY,nodetype,addTAG,deleteTag,modifyTag} = {...this.state.rightClickNodeTreeItem};
    const tmpStyle = {
        position: 'absolute',
        left: `${pageX}px`,
        top: `${pageY}px`,
        boxShadow: '2px 3px 10px #888'
    };
    const itemstyle={height:'28px',lineHeight:'28px'};
    let menu = null
    if(nodetype === 0){
      menu = (
        <Menu
          style={tmpStyle}
          onClick={this.handleMenuClick}
        >
          {addTAG&&this.state.ManaAuth[0]?     <Menu.Item key='1' style={itemstyle} ><Icon type='plus-circle-o'/>{'添加区域'}</Menu.Item>:null}
          {addTAG&&this.state.ManaAuth[0]?   <Menu.Divider />:null}
          {deleteTag&&this.state.ManaAuth[2]?<Menu.Item key='2' style={itemstyle} ><Icon type="close-circle-o" />{'删除区域'}</Menu.Item>:null}
           {deleteTag&&this.state.ManaAuth[2]?<Menu.Divider />:null}
           {modifyTag&&this.state.ManaAuth[1]? <Menu.Item key='3' style={itemstyle} ><Icon type='edit'/>{'修改区域'}</Menu.Item>:null}
       </Menu>
      );
    }   
   // return (this.state.rightClickNodeTreeItem == null) ? '' : menu;
   return (this.state.rightClickNodeTreeItem == null) ? '' :<div>{menu}</div>;
  }

  handleMenuClick = (info)=>{
    switch(info.key){
      case "1":
        this.AddRegion();
        break;
      case "2":
        this.DelRegion();
        break;
      case "3":
        this.MfyRegion();
        break;
    }
  }

  AddRegion = () => { 
    let logicaddr = rightselectnode.props.dataRef['logicaddr']; 
    console.log(logicaddr)
    let logicaddrarr=["","","","","",""]
    let logicaddrwritable=[false,false,false,false,false,false]
    let firstFF = true;
    for(let  i = 0;i < 6;i++){
      switch (i) {
        case 0:
        logicaddrarr[i] = logicaddr[2 * i] + logicaddr[2 * i + 1];
              if(logicaddrarr[i] === "00"){
                if(firstFF){
                  logicaddrarr[i] = "";
                  firstFF = false
                  logicaddrwritable[i] = true;
                }        
              }
          break;
          case 1:
          logicaddrarr[i] = logicaddr[2 * i] + logicaddr[2 * i + 1];
          if(logicaddrarr[i] === "00"){
            if(firstFF){
              logicaddrarr[i] = "";
              firstFF = false
              logicaddrwritable[i] = true;
            }        
          }
          break;
          case 2:
          logicaddrarr[i] = logicaddr[2 * i] + logicaddr[2 * i + 1];
          if(logicaddrarr[i] === "00"){
            if(firstFF){
              logicaddrarr[i] = "";
              firstFF = false
              logicaddrwritable[i] = true;
            }        
          }
          break;
          case 3:
          logicaddrarr[i] = logicaddr[6] + logicaddr[7] + logicaddr[8];
          if(logicaddrarr[i] === "000"){
            if(firstFF){
              logicaddrarr[i] = "";
              firstFF = false
              logicaddrwritable[i] = true;
            }        
          }
          break;
          case 4:
          logicaddrarr[i] = logicaddr[9] + logicaddr[10] + logicaddr[11];
          if(logicaddrarr[i] === "000"){
            if(firstFF){
              logicaddrarr[i] = "";
              firstFF = false
              logicaddrwritable[i] = true;
            }        
          }
          break;
          case 5:
          logicaddrarr[i] = logicaddr[12] + logicaddr[13];
          if(logicaddrarr[i] === "00"){
            if(firstFF){
              logicaddrarr[i] = "";
              firstFF = false
              logicaddrwritable[i] = true;
            }        
          }
          break;
        default:
          break;
      }
      // logicaddrarr[i] = logicaddr[2 * i] + logicaddr[2 * i + 1];
      // if(logicaddrarr[i] === "FF"){
      //   if(firstFF){
      //     logicaddrarr[i] = "";
      //     firstFF = false
      //     logicaddrwritable[i] = true;
      //   }        
      // }
    } 
    this.setState({
      visRegForm: true,
      FormTitle:"添加区域",
      logicaddrarr:logicaddrarr,
      logicaddrwritable:logicaddrwritable,
      modifyName:'',
      regiontag:false,
      Addshowlogi:true
    });  
  }

  DelRegion = () => { 
    if(rightselectnode === null)
      return;
    var aa = this
    //console.log(selectnode)
    Modal.confirm({
      title: '删除区域',
    content: '确定要删除该区域吗?',
      onOk(){
        let r = {
        method: "POST",
        body: JSON.stringify({"opt":"delRegion", "id":rightselectnode.props.dataRef['id']})
        }
        netdata('/topoly/regionTreeOpt.epy', r).then(aa.ondata.bind(aa))
      }
    })
  }

  MfyRegion = () => { 
    if(rightselectnode === null)
      return;
    let logicaddr = rightselectnode.props.dataRef['logicaddr']; 
    let logicaddrarr=["","","","","",""];
    let desc =  rightselectnode.props.dataRef['desc'];  
     let logicaddrwritable=[false,false,false,false,false,false]
    // let firstFF = true;
    let num =logicaddr.indexOf("FF");
    let numx =num/2-1;
    let tagg=true;
    for(let  i = 0;i < 6;i++){
      switch (i) {
        case 0:
        logicaddrarr[i] = logicaddr[2 * i] + logicaddr[2 * i + 1];
        if(tagg)
        {
          if(logicaddrarr[i] === "00"){
          logicaddrwritable[i-1] = true;    
          tagg=false;  
        }
        }
          break;
          case 1:
          logicaddrarr[i] = logicaddr[2 * i] + logicaddr[2 * i + 1];
          if(tagg)
          {
            if(logicaddrarr[i] === "00"){
            logicaddrwritable[i-1] = true;    
            tagg=false;  
          }
          }
          break;
          case 2:
          logicaddrarr[i] = logicaddr[2 * i] + logicaddr[2 * i + 1];
          if(tagg)
          {
            if(logicaddrarr[i] === "00"){
            logicaddrwritable[i-1] = true;    
            tagg=false;  
          }
          }
          break;
          case 3:
          logicaddrarr[i] = logicaddr[6] + logicaddr[7] + logicaddr[8];
          if(tagg)
          {
            if(logicaddrarr[i] === "000"){
            logicaddrwritable[i-1] = true;    
            tagg=false;  
          }
          }
          break;
          case 4:
          logicaddrarr[i] = logicaddr[9] + logicaddr[10] + logicaddr[11];
          if(tagg)
          {
            if(logicaddrarr[i] === "000"){
            logicaddrwritable[i-1] = true;    
            tagg=false;  
          }
          }
          break;
          case 5:
          logicaddrarr[i] = logicaddr[12] + logicaddr[13];
          if(tagg)
          {
            if(logicaddrarr[i] === "00"){
            logicaddrwritable[i-1] = true;    
            tagg=false;  
          }
          }
          break;
        default:
          break;
      }
      // logicaddrarr[i] = logicaddr[2 * i] + logicaddr[2 * i + 1];
      // if(logicaddrarr[i] === "FF"){
      //   if(firstFF){
      //     logicaddrarr[i] = "";
      //     firstFF = false
      //     logicaddrwritable[i] = true;
      //   }        
      // }
    }  

    // let tag=false;
    // for(let i=0;i<6;i++){
    //   if(logicaddrwritable[i]){
    //     tag=true;
    //   }
    // }
    // if(!tag){
    //   logicaddrwritable[5]=true;
    // }
    this.setState({
      visRegForm: true,
      FormTitle:"修改区域",
      logicaddrarr:logicaddrarr,
      logicaddrwritable:logicaddrwritable,
      modifyName:desc,
      regiontag:false,
      Addshowlogi:true
    });  
  }

  AddDevice = (type) =>{
    if(selectnode == null)
      return;
    let logicaddr = selectnode.props.dataRef['logicaddr']; 
    let logicaddrarr=["","","","","",""]
    let logicaddrarr1=["","","","","",""]
    let logicaddrwritable=[false,false,false,false,false,false]
    // for(let i = 0;i < 6;i++){
    //   logicaddrarr[i] = logicaddr[2 * i] + logicaddr[2 * i + 1];
    //   logicaddrarr1[i] = logicaddr[2 * i] + logicaddr[2 * i + 1];
    //   if(logicaddrarr[i] === "FF"){
    //     logicaddrarr[i] = "";
    //     logicaddrarr1[i] = logicaddr[2 * i] + logicaddr[2 * i + 1];
    //     logicaddrwritable[i] = true;
    //   }        
    // }   
    for(let  i = 0;i < 6;i++){
      switch (i) {
        case 0:
        logicaddrarr[i] = logicaddr[2 * i] + logicaddr[2 * i + 1];
        logicaddrarr1[i] = logicaddr[2 * i] + logicaddr[2 * i + 1];
          break;
          case 1:
          logicaddrarr[i] = logicaddr[2 * i] + logicaddr[2 * i + 1];
          logicaddrarr1[i] = logicaddr[2 * i] + logicaddr[2 * i + 1];
          break;
          case 2:
          logicaddrarr[i] = logicaddr[2 * i] + logicaddr[2 * i + 1];
          logicaddrarr1[i] = logicaddr[2 * i] + logicaddr[2 * i + 1];
          break;
          case 3:
          logicaddrarr[i] = logicaddr[6] + logicaddr[7] + logicaddr[8];
          logicaddrarr1[i] = logicaddr[6] + logicaddr[7] + logicaddr[8];
          break;
          case 4:
          logicaddrarr[i] = logicaddr[9] + logicaddr[10] + logicaddr[11];
          logicaddrarr1[i] = logicaddr[9] + logicaddr[10] + logicaddr[11];
          break;
          case 5:
          logicaddrarr[i] = logicaddr[12] + logicaddr[13];
          logicaddrarr1[i] = logicaddr[12] + logicaddr[13];
          logicaddrwritable[i] = true;
          break;
        default:
          break;
      }
    } 
    



    // let phyaddrarr;
    // if(type==="1"){
    //   phyaddrarr=["17","01","","","",""]
    // }
    // else{
    //   phyaddrarr=["11","88","","","",""]
    // }
    this.setState({
      visRegForm: true,
      FormTitle:"添加设备",
      // phyaddrarr:phyaddrarr,
      logicaddrarr:logicaddrarr,
      logicaddrarr1:logicaddrarr1,
      logicaddrwritable:logicaddrwritable,
      modifyName:'',
      Addshowlogi:type==="1",
      regiontag:true
    });  
  }

  MfyDevice = () =>{
    
  }

  DelDevice = () =>{
    var aa = this
    if(this.state.selectedRowKeys.length !== 0){
      let selectdev = "";
      let isFirst = true;
      this.state.selectedRowKeys.map((item)=>{
        if(isFirst){
          selectdev += dData[item].id
          isFirst = false
        }
        else{
          selectdev += "," + dData[item].id
        }
      })
      Modal.confirm({
        title: '删除设备',
        content: '确定要删除选中设备吗?',
        onOk(){
          let r = {
          method: "POST",
          body: JSON.stringify({"opt":"delDevice", "parentid":selectnode.props.dataRef['id'],"ids":selectdev})
          }
        netdata('/topoly/regionTreeOpt.epy', r).then(aa.ondata.bind(aa))    
        }  
      })
    }    
  }

  handleCancel = () => {
    this.setState({
      visRegForm: false,
    });
  }
  handleCanceledit = () => {
    this.update();
    this.setState({
      editvisable: false,
    });
  }
  Name(e){
    let value=e.target.value;
    let id =e.target.id
    let namelst = this.state.logicaddrarr;
    namelst[id]=value;
    //console.log("11",namelst)
    if(isFinite(value)){
      this.setState({
        name: namelst
      });
    }
    else{
    }
  }
  // Namephy(e){
  //   let value=e.target.value;
  //   let id =e.target.id
  //   let namelst = this.state.phyaddrarr;
  //   namelst[id]=value;
  //   //console.log("11",namelst)
  //   if(isFinite(value)){
  //     this.setState({
  //       phyaddrarr: namelst
  //     });
  //   }
  //   else{
  //   }
  // }
  // Namephyedit(e){
  //   let value=e.target.value;
  //   let id =e.target.id
  //   let namelst = this.state.phyaddrarredit;
  //   namelst[id]=value;
  //   //console.log("11",namelst)
  //   if(isFinite(value)){
  //     this.setState({
  //       phyaddrarredit: namelst
  //     });
  //   }
  //   else{
  //   }
  // }
  Nameedit(e){
    let value=e.target.value;
    let id =e.target.id
    let namelst = this.state.logicaddrarredit;
    namelst[id]=value;
    //console.log("11",namelst)
    if(isFinite(value)){
      this.setState({
        logicaddrarredit: namelst
      });
    }
    else{
    }
  }
  Regionsubmit = () => {

    let subname =this.state.modifyName
    let subaddr="";
    let subaddr1="";
    // let phyaddr ="";
    if(subname==""){
      Notification['error']({
        message: '名称不能为空！',
      });
      this.setState({
        confirmLoading: false,
      });
      return;
    }
    for(let i=0;i<6;i++){
      subaddr += this.state.logicaddrarr[i];
      subaddr1 += this.state.logicaddrarr1[i];
  
    }
  
    if(this.state.FormTitle === "添加区域"){
      if(this.state.logicaddrarr[1].length!=2){
        Notification['error']({
           message: '请输入两位数字！',
         });
         return;
}
if(this.state.logicaddrarr[2].length!=2){
Notification['error']({
   message: '请输入两位数字！',
 });
 return;
}
if(this.state.logicaddrarr[3].length!=3){
Notification['error']({
message: '请输入三位数字！',
});
return;
}
if(this.state.logicaddrarr[4].length!=3){
Notification['error']({
message: '请输入三位数字！',
});
return;
}
if(this.state.logicaddrarr[5].length!=2){
Notification['error']({
message: '请输入两位数字！',
});
return;
}
this.setState({
  confirmLoading: true,
});
      let r = {
        method: "POST",
        body: JSON.stringify({"opt":"addRegion", "parentid":rightselectnode.props.dataRef['id'].toString(),"logicaddr":subaddr,"desc":subname})
      }
      netdata('/topoly/regionTreeOpt.epy', r).then(this.ondata.bind(this))
    }



    else if(this.state.FormTitle === "修改区域"){
      if(this.state.logicaddrarr[1].length!=2){
        Notification['error']({
           message: '请输入两位数字！',
         });
         return;
      }
      if(this.state.logicaddrarr[2].length!=2){
      Notification['error']({
      message: '请输入两位数字！',
      });
      return;
      }
      if(this.state.logicaddrarr[3].length!=3){
      Notification['error']({
      message: '请输入三位数字！',
      });
      return;
      }
      if(this.state.logicaddrarr[4].length!=3){
      Notification['error']({
      message: '请输入三位数字！',
      });
      return;
      }
      if(this.state.logicaddrarr[5].length!=2){
      Notification['error']({
      message: '请输入两位数字！',
      });
      return;
      }
      this.setState({
        confirmLoading: true,
      });
      let r = {
        method: "POST",
        body: JSON.stringify({"opt":"mfyRegion", "id":rightselectnode.props.dataRef['id'].toString(),"logicaddr":subaddr,"desc":subname})
      }
      netdata('/topoly/regionTreeOpt.epy', r).then(this.ondata.bind(this))
      // r = {
      //   method: "POST",
      //   body: JSON.stringify({"opt":"getTree"})
      // }
      // netdata('/topoly/regionTreeOpt.epy', r).then(this.ondata.bind(this))
    }
    else if(this.state.FormTitle === "添加设备"){
      // for(let i=0;i<6;i++){
        
      //        if(this.state.phyaddrarr[i]==""){
      //          Notification['error']({
      //            message: '物理地址不能为空！',
      //          });
      //          this.setState({
      //            confirmLoading: false,
      //          });
      //          return;
      //        }
      //        phyaddr += this.state.phyaddrarr[i];
      //      }



      if(this.state.ensnmp=="1")
  {    if(!this.isValidIP(this.state.ipaddr)){
        Notification['error']({
          message: 'ip地址不合法！',
        });        this.setState({
          confirmLoading: false,
        });
        return;
      }}

      let r;
      if(this.state.Addshowlogi){
        r = {
        method: "POST",
        // body: JSON.stringify({"opt":"addDevice", "parentid":selectnode.props.dataRef['id'].toString(),"logicaddr":subaddr,"desc":subname,"latitude":"","longitude":"","IsNetworkManage": this.state.ensnmp?"0":"1","NetManageIp": this.state.ipaddr,"ReadStr": this.state.ReadStr,"WriteStr": this.state.WriteStr,"SnmpVer": this.state.SnmpVer,"PhyAddr":"1234567890","DevType":"1","QAM":"1","NetworkEN":"1","NetworkMode":"1","IpAddr":"","Mask":"255.255.255.0","Gateway":"192.168.101.1","TimeInterval":"180","LEDEN":"0","Brightness":"20","LEDRollSpeed":"100","ShowTimeEN":"10"})
        // body: JSON.stringify({"opt":"addDevice", "parentid":selectnode.props.dataRef['id'].toString(),"logicaddr":subaddr,"PhyAddr":phyaddr,"desc":subname,"latitude":"","longitude":"","IsNetworkManage": this.state.ensnmp?"1":"0","NetManageIp": this.state.ipaddr,"ReadStr": this.state.ReadStr,"WriteStr": this.state.WriteStr,"SnmpVer": this.state.SnmpVer,"DevType":"1"})  
        body: JSON.stringify({"opt":"addDevice", "parentid":selectnode.props.dataRef['id'].toString(),"logicaddr":subaddr,"desc":subname,"latitude":"","longitude":"","IsNetworkManage": this.state.ensnmp?"1":"0","NetManageIp": this.state.ipaddr,"ReadStr": this.state.ReadStr,"WriteStr": this.state.WriteStr,"SnmpVer": this.state.SnmpVer,"DevType":"1"})  
        
      }
      }else{
        r = {
        method: "POST",
        // body: JSON.stringify({"opt":"addDevice", "parentid":selectnode.props.dataRef['id'].toString(),"logicaddr":subaddr1,"PhyAddr":phyaddr,"desc":subname,"latitude":"","longitude":"","IsNetworkManage": this.state.ensnmp?"1":"0","NetManageIp": this.state.ipaddr,"ReadStr": this.state.ReadStr,"WriteStr": this.state.WriteStr,"SnmpVer": this.state.SnmpVer,"DevType":this.state.DevType})  
        body: JSON.stringify({"opt":"addDevice", "parentid":selectnode.props.dataRef['id'].toString(),"logicaddr":subaddr1,"desc":subname,"latitude":"","longitude":"","IsNetworkManage": this.state.ensnmp?"1":"0","NetManageIp": this.state.ipaddr,"ReadStr": this.state.ReadStr,"WriteStr": this.state.WriteStr,"SnmpVer": this.state.SnmpVer,"DevType":this.state.DevType})  
        
      }
      }

      netdata('/topoly/regionTreeOpt.epy', r).then(this.ondata.bind(this))
    }
  }

  focusnode(e){
    document.getElementById("querytag").className = 'ipt-fake-box focus'; 
  }

  blurnode(e){
    document.getElementById("querytag").className = ''; 
  }
  MapsetClick(e){
    if(!this.state.ManaAuth[4]){
      Notification['info']({
        message: '无修改权限！'
      });
      return ;
    }
    this.setState({MapsetVisable:true,MapRowId:e.target.value})
    this.store.setState({devicedata:this.state.devicedata,id:e.target.value})
  }
  MapsethandleOk(){
    let that =this;
    const {devicedata } =this.state;
    
    let id = this.state.MapRowId;
    let subdata=[];
    for(let i=0;i<devicedata.length;i++){
      if(devicedata[i].id==id){
        subdata=devicedata[i];
      }
    }
   
    const { latlng } = this.store1.getState();
     subdata.longitude =latlng.lng||"";
     subdata.latitude =latlng.lat||"";
     subdata["opt"]="mfyDevice";
      let r = {
        method: "POST",
        body: JSON.stringify(subdata)
      }
      netdata('/topoly/regionTreeOpt.epy', r).then(res=>{
        // that.store.setState({devicedata:devicedata})

        if(res.d.errCode === 0){
          that.setState({MapsetVisable:false})
          }else{
            Notification['error']({
              message: '数据请求错误',
              description: JSON.stringify(res.d.errCode),
            });
          }
      }     
      )
  }
  Regionsubmitedit(){
    let that =this;
    const {devicedata } =this.state;
    let id = this.state.MapRowId;
    if(this.state.ensnmpedit)
{   
   if(this.state.WriteStredit==''||this.state.ReadStredit==''||this.state.modifyNameedit==''){
     Notification['error']({
      message: '在可网管状态下，数据不能为空！',
    });
      return;
    }
if(!this.isValidIP(this.state.ipaddredit)){
  Notification['error']({
    message: 'ip地址不合法',
  });
    return;
}
}

    let subdata=[];
    for(let i=0;i<devicedata.length;i++){
      if(devicedata[i].id==id){
        subdata=devicedata[i];
      }
    }
    let subaddr=""
    let subaddr1=""
    // let phyaddr=""
    for(let i=0;i<6;i++){
      subaddr += this.state.logicaddrarredit[i];
      subaddr1 += this.state.logicaddrarredit1[i];
      // if(this.state.phyaddrarredit[i]==""){
      //   Notification['error']({
      //     message: '物理地址不能为空！',
      //   });
      //   return;
      // }
      // phyaddr += this.state.phyaddrarredit[i];
    }
    subdata["opt"]="mfyDevice";
    subdata.WriteStr=this.state.WriteStredit;
    subdata.ReadStr=this.state.ReadStredit;
    subdata.SnmpVer=this.state.SnmpVeredit;
    subdata.NetManageIp=this.state.ipaddredit;
    subdata.IsNetworkManage=this.state.ensnmpedit?"1":"0";
    if(this.state.DevTypeedit=="1"){
        subdata.logicaddr=subaddr;
    }else{
      subdata.DevType=this.state.DevTypeedit;
    }
    
    subdata.desc=this.state.modifyNameedit;


    if(this.state.logicaddrarredit[1].length!=2){
      Notification['error']({
         message: '请输入两位数字！',
       });
       return;
    }
    if(this.state.logicaddrarredit[2].length!=2){
    Notification['error']({
    message: '请输入两位数字！',
    });
    return;
    }
    if(this.state.logicaddrarredit[3].length!=3){
    Notification['error']({
    message: '请输入三位数字！',
    });
    return;
    }
    if(this.state.logicaddrarredit[4].length!=3){
    Notification['error']({
    message: '请输入三位数字！',
    });
    return;
    }
    if(this.state.logicaddrarredit[5].length!=2){
    Notification['error']({
    message: '请输入两位数字！',
    });
    return;
    }


    // subdata.PhyAddr=phyaddr;
    let r = {
      method: "POST",
      body: JSON.stringify(subdata)
    }
    netdata('/topoly/regionTreeOpt.epy', r).then(res=>{
      // that.store.setState({devicedata:devicedata})
      if(res.d.errCode === 0){
      that.setState({editvisable:false})
      }else{
        Notification['error']({
          message: '数据请求错误',
          description: JSON.stringify(res.d.errCode),
        });
      }
    }  
  )

  }
  MapsethandleCancel(){
    this.setState({MapsetVisable:false})
  }
  Name1(e){
    let value=e.target.value;
    this.setState({
      modifyName: value
    });
  }
  Name2(e){
    let value=e.target.value;
    this.setState({
      ipaddr: value
    });
  }
  Name3(e){
    let value=e.target.value;
    this.setState({
      ReadStr: value
    });
  }
  Name4(e){
    let value=e.target.value;
    this.setState({
      WriteStr: value
    });
  }
  Name5(e){
    this.setState({
      SnmpVer: e
    });
  }
  // Name6(e){
  //   let phy=[];
  //   switch (e) {
  //     case '2':
  //       phy=["11","88","","","",""] 
  //       break;
  //     case '3':
  //       phy=["11","91","","","",""] 
  //       break;
  //     case '4':
  //       phy=["11","81","","","",""] 
  //       break;
  //     case '5':
  //       phy=["11","92","","","",""] 
  //       break;
  //     default:
  //       break;
  //   }
  //   this.setState({
  //     DevType: e,
  //     phyaddrarr: phy,
  //   });
  // }
  Name1edit(e){
    let value=e.target.value;
    this.setState({
      modifyNameedit: value
    });
  }
  Name2edit(e){
    let value=e.target.value;
    this.setState({
      ipaddredit: value
    });
  }
  Name3edit(e){
    let value=e.target.value;
    this.setState({
      ReadStredit: value
    });
  }
  Name4edit(e){
    let value=e.target.value;
    this.setState({
      WriteStredit: value
    });
  }
  Name5edit(e){
    this.setState({
      SnmpVeredit: e
    });
  }
  Name6(e){
    this.setState({
      DevType: e
    });
  }
  Name6edit(e){
    // let phy=[];
    // switch (e) {
    //   case '2':
    //     phy=["11","88","","","",""] 
    //     break;
    //   case '3':
    //     phy=["11","91","","","",""] 
    //     break;
    //   case '4':
    //     phy=["11","81","","","",""] 
    //     break;
    //   case '5':
    //     phy=["11","92","","","",""] 
    //     break;
    //   default:
    //     break;
    // }
    this.setState({
      DevTypeedit: e,
      // phyaddrarredit: phy,
    });
  }
  ensnmponChange(checked){
    this.setState({ensnmp:checked})
  }
  ensnmponChangeedit(checked){
    this.setState({ensnmpedit:checked})
  }
  showyzadd(){
    let percent=this.state.percent;
    let percentstatus=this.state.percentstatus;
    let percenttooltip=this.state.percenttooltip;
    for(let i=0;i<percent.length;i++){
         percent[i]=0;
   percentstatus[i]="active";
   percenttooltip[i]=""
    }

      this.setState({yzaddVisable:true,percent:percent,percentstatus:percentstatus,percenttooltip:percenttooltip})
  }
  yzaddhandleOk(){
    this.setState({addcancel:true})
    setTimeout(() => {
       this.adddevloop(this.state.yzaddsheetdata,0)
    }, 1000);
   
  }

  adddevloop(data,index){

if(this.state.addcancel){

    if(data.length<=index){
      return ;
    }   
     let percent=this.state.percent;
     let percentstatus=this.state.percentstatus;
    //  let percenttooltip=this.state.percenttooltip;
    percent[index+1]=35;
    percentstatus[index+1]="active";
    // percenttooltip[index+1]="";
    this.setState({percent:percent,percentstatus:percentstatus})
    let that =this;
    let dd =data[index];
   let r = {
      method: "POST",
      // body: JSON.stringify({"opt":"addDevice", "parentid":selectnode.props.dataRef['id'].toString(),"logicaddr":subaddr,"PhyAddr":phyaddr,"desc":subname,"latitude":"","longitude":"","IsNetworkManage": this.state.ensnmp?"1":"0","NetManageIp": this.state.ipaddr,"ReadStr": this.state.ReadStr,"WriteStr": this.state.WriteStr,"SnmpVer": this.state.SnmpVer,"DevType":"1"})  
      body:JSON.stringify({"opt":"addDevice","parentid":selectnode.props.dataRef['id'],"logicaddr":dd["逻辑地址"],"desc":dd["名称"],"latitude":dd["经度"],"longitude":dd["纬度"],"IsNetworkManage":dd["是否网管"],"NetManageIp":dd["网管IP"],"ReadStr":dd["读字符串"],"WriteStr":dd["写字符串"],"SnmpVer":dd["snmp版本"],"DevType":dd["设备类型"]})
    }
    netdata('/topoly/regionTreeOpt.epy', r).then(
    (res)=> { if(res.d.errCode === 0){
      let percent=that.state.percent;
      let percentstatus=that.state.percentstatus;
      percent[index+1]=100;
      percentstatus[index+1]="success";
      that.setState({percent:percent,percentstatus:percentstatus})
       that.adddevloop(data,index+1)

      }
      else{
        let percent=that.state.percent;
        let percentstatus=that.state.percentstatus;
        let percenttooltip=that.state.percenttooltip;
        percent[index+1]=70;
        percentstatus[index+1]="exception";
        percenttooltip[index+1]=res.d.errCode;
        that.setState({percent:percent,percentstatus:percentstatus,percenttooltip:percenttooltip})
        that.adddevloop(data,index+1)
      }
      }
    
    )
  }
  }

  yzaddhandleCancel(){
    this.update()
    this.setState({yzaddVisable:false,addcancel:false})
      }
outputexcel(){

if(selectnode===null){
  Notification['error']({
    message: '请先选择区域！'
  });
  return;
  
}
  var type="xlsx";
  let data =this.state.devicedata;
let json=[];
  for(let i=0;i<data.length;i++){
    json.push({"index":i+1,"名称":data[i].desc,"设备类型":data[i].DevType,"所在区域":data[i].RegionName,"逻辑地址":data[i].logicaddr,"经度":data[i].longitude,"纬度":data[i].latitude,"是否网管":data[i].IsNetworkManage,"网管IP":data[i].NetManageIp,"读字符串":data[i].ReadStr,"写字符串":data[i].WriteStr,"snmp版本":data[i].SnmpVer})
  }
        // var json = [{ 主页: "111", 名称: "6800", 数量: "6800", 昵称: "广告主网" }, { 主页: "433", 名称: "6800", 数量: "6800", 昵称: "广告主网" }, { 名称: "22", 商家: "6800", 数量: "6800", 昵称: "广告主网", }, { 名称: "43", 商家: "6800", 数量: "6800", 昵称: "广告主网", }, { 店家: "43", 价格: "6800", 数量: "6800", 昵称: "广告主网", }];
        var tmpdata = json[0];
        json.unshift({});
        var keyMap = []; //获取keys
        //keyMap =Object.keys(json[0]);
        for (var k in tmpdata) {
            keyMap.push(k);
            json[0][k] = k;
        }
      var tmpdata = [];//用来保存转换好的json 
            json.map((v, i) => keyMap.map((k, j) => Object.assign({}, {
                v: v[k],
                position: (j > 25 ? this.getCharCol(j) : String.fromCharCode(65 + j)) + (i + 1)
            }))).reduce((prev, next) => prev.concat(next)).forEach((v, i) => tmpdata[v.position] = {
                v: v.v
            });
            var outputPos = Object.keys(tmpdata); //设置区域,比如表格从A1到D10
            var tmpWB = {
                SheetNames: ['mySheet'], //保存的表标题
                Sheets: {
                    'mySheet': Object.assign({},
                        tmpdata, //内容
                        {
                            '!ref': outputPos[0] + ':' + outputPos[outputPos.length - 1] //设置填充区域
                        })
                }
            };
            tmpDown = new Blob([this.s2ab(XLSX.write(tmpWB, 
                {bookType: (type == undefined ? 'xlsx':type),bookSST: false, type: 'binary'}//这里的数据是用来定义导出的格式类型
                ))], {
                type: ""
            }); //创建二进制对象写入转换好的字节流
        var href = URL.createObjectURL(tmpDown); //创建对象超链接
        document.getElementById("hf").href = href; //绑定a标签
        document.getElementById("hf").click(); //模拟点击实现下载
        setTimeout(function() { //延时释放
            URL.revokeObjectURL(tmpDown); //用URL.revokeObjectURL()来释放这个object URL
        }, 100);

      }
       s2ab(s) { //字符串转字符流
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    }
     // 将指定的自然数转换为26进制表示。映射关系：[0-25] -> [A-Z]。
     getCharCol(n) {
        let temCol = '',
        s = '',
        m = 0
        while (n > 0) {
            m = n % 26 + 1
            s = String.fromCharCode(m + 64) + s
            n = (n - m) / 26
        }
        return s
    }

    clickreback(){
      this.props.history.replace('/AppsMana') 
  }


renderyzaddtable(data){
  const columns11 = [{
    title: '名称',
    dataIndex: '名称',
    key: '名称',
    // fixed: 'left' ,
    width: 100
  }, {
    title: '设备类型',
    dataIndex: '设备类型',
    key: '设备类型',
    className: 'colcenter',
    width: 150,
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
    title: '逻辑地址',
    dataIndex: '逻辑地址',
    key: '逻辑地址',
    width: 100
  }, 
  // {
  //   title: '物理地址',
  //   dataIndex: '物理地址',
  //   key: '物理地址',
  //   width: 100
  // },
   {
    title: '经度',
    dataIndex: '经度',
    key: '经度',
    width: 100
  }, {
    title: '纬度',
    dataIndex: '纬度',
    key: '纬度',
    width: 100
  }, {
    title: '是否网管',
    dataIndex: '是否网管',
    key: '是否网管',  
    width: 100 
  }, {
    title: '网管IP',
    dataIndex: '网管IP',
    key: '网管IP',
    width: 100
  }, {
    title: '读字符串',
    dataIndex: '读字符串',
    key: '读字符串',
    width: 100
  }, {
    title: '写字符串',
    dataIndex: '写字符串',
    key: '写字符串',
    width: 100
  }, {
    title: 'snmp版本',
    dataIndex: 'snmp版本',
    key: 'snmp版本',
    width: 100   
  },{
    title:"进度",
    fixed:"right",
     width:150,
    render: (text, record) => (
      <Tooltip title={this.state.percenttooltip[record.index]}>
      <Progress percent={this.state.percent[record.index]} status={this.state.percentstatus[record.index]}  size="small" />
      {this.state.percenttooltip[record.index]}
      </Tooltip>
    )
  }];
  // return data.map((item) => {

  //   return(<div>{item["逻辑地址"]} </div>)


  // })

return (<Table dataSource={data} columns={columns11} pagination={false}  size="small" bordered scroll={{x:1380,y:536}}/>)

      }

importf(obj) {//导入
  let that =this;
          if(!obj.target.files) {
              return;
          }
          var f = obj.target.files[0];
          var reader = new FileReader();
          reader.onload = function(e) {
              var data = e.target.result;
              if(rABS) {
                  wb = XLSX.read(btoa(this.fixdata(data)), {//手动转化
                      type: 'base64'
                  });
              } else {
                  wb = XLSX.read(data, {
                      type: 'binary'
                  });
              }
              //wb.SheetNames[0]是获取Sheets中第一个Sheet的名字
              //wb.Sheets[Sheet名]获取第一个Sheet的数据
    
              let sheetjson =XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])
              // console.log(sheetjson[0]["逻辑地址"])
              let percent=[]
              let percentstatus=[]
              let percenttooltip=[]
              for(let i=0;i<sheetjson.length;i++){
                percentstatus.push("active");
                percent.push(0);
                percenttooltip.push('')
              }
              that.setState({yzaddsheetdata:sheetjson,percent:percent,percentstatus:percentstatus,percenttooltip:percenttooltip})
              that.refs.inputfile.value="";
          };
          try {
                      if(rABS) {
              reader.readAsArrayBuffer(f);
          } else {
              reader.readAsBinaryString(f);
          }
          } catch (error) {
            
          }

      }

    fixdata(data) { 
          var o = "",
              l = 0,
              w = 10240;
          for(; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
          o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));

          return o;
      }




  showeditmodal(data,e){
    if(!this.state.ManaAuth[4]){
      Notification['info']({
        message: '无修改权限！'
      });
      return ;
    }
     let logicaddr = data.logicaddr;
     let phyaddr =data.PhyAddr;
    let logicaddrarr=["","","","","",""]
    let logicaddrarr1=["","","","","",""]
    // let phyaddrarr=["","","","","",""]
    for(let i = 0;i < 6;i++){
      if(i==3)
      {
        logicaddrarr[i] = logicaddr[6] + logicaddr[7]+ logicaddr[8];
        logicaddrarr1[i] = logicaddr[6] + logicaddr[7]+ logicaddr[8];
      }else if(i==4){
        logicaddrarr[i] = logicaddr[9] + logicaddr[10]+ logicaddr[11];
        logicaddrarr1[i] = logicaddr[9] + logicaddr[10]+ logicaddr[11];
      }else if(i==5){
        logicaddrarr[i] = logicaddr[12] + logicaddr[13];
        logicaddrarr1[i] = logicaddr[12] + logicaddr[13];
      }else
      {logicaddrarr[i] = logicaddr[2 * i] + logicaddr[2 * i + 1];
      logicaddrarr1[i] = logicaddr[2 * i] + logicaddr[2 * i + 1];}
      // phyaddrarr[i] = phyaddr[2 * i] + phyaddr[2 * i + 1];
      // if(logicaddrarr[i] === "FF"){
      //   logicaddrarr[i] = "";
      //   logicaddrarr1[i] = logicaddr[2 * i] + logicaddr[2 * i + 1];
      // }        
    } 


    if(data.DevType==="1"){
      this.setState({Addshowlogiedit:true})
    }
    else{
      this.setState({Addshowlogiedit:false})
    }
    this.setState({editvisable:true,
      MapRowId:data.id,
      modifyNameedit:data.desc,
      ipaddredit:data.NetManageIp,
      WriteStredit:data.WriteStr,
      ReadStredit:data.ReadStr,
      DevTypeedit:data.DevType,
      ensnmpedit:data.IsNetworkManage=="1"?true:false,
      logicaddrarredit:logicaddrarr,
      logicaddrarredit1:logicaddrarr1,
      // phyaddrarredit:phyaddrarr
    })
  }
  render() {
    const {yzaddVisable,MapsetVisable,visRegForm,devicedata,selectedRowKeys,confirmLoading,logicaddrarredit,logicaddrarredit1,logicaddrarr,logicaddrarr1,logicaddrwritable,FormTitle,serachTxt}= this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    }

    const columns = [,
      {
      title: '名称',
      dataIndex: 'desc',
      key: 'desc',
      render: (text, record) => {
        return (<a onClick={this.showeditmodal.bind(this,record)}>{text} </a>)
      }
    },
      {
        title: '设备类型',
        dataIndex: 'DevType',
        className: 'colcenter',
        width: "120px",
        key: 'DevType',
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
        title: '所在区域',
        dataIndex: 'RegionName',
        key: 'RegionName',
      }, {
      title: '逻辑地址',
      dataIndex: 'logicaddr',
      key: 'logicaddr',
    },
    //  {
    //   title: '物理地址',
    //   dataIndex: 'PhyAddr',
    //   key: 'PhyAddr',
    // },
    {
      title: '经度',
      dataIndex: 'longitude',
      key: 'longitude',
    }, {
      title: '纬度',
      dataIndex: 'latitude',
      key: 'latitude',
    }, 
    
    {
      title: '是否网管',
      dataIndex: 'IsNetworkManage',
      key: 'IsNetworkManage',
      render: (text, record) => 
      {  switch (text) {
          case "0":
            return "否";
            break;
          case "1":
          return '是';
            return ;
            break;
          default:
          return '未知';
            break;
        }
      }
    },{
      title: '网管IP',
      dataIndex: 'NetManageIp',
      key: 'NetManageIp',
    },{
      title: '读字符串',
      dataIndex: 'ReadStr',
      key: 'ReadStr',
    },{
      title: '写字符串',
      dataIndex: 'WriteStr',
      key: 'WriteStr',
    },{
      title: 'snmp版本',
      dataIndex: 'SnmpVer',
      key: 'SnmpVer',
      render: (text, record) => 
      {  switch (text) {
          case "1":
            return "SnmpVer1";
            break;
          case "2":
          return 'SnmpVer2';
            return ;
            break;
          default:
          return '未知';
            break;
        }
      
      } 
    },
    
    {
       title: '位置设置',
      dataIndex: 'action',
      key: 'action',
      className: 'colcenter',
      width: "40px",
      fixed: 'right',
      render: (text, record) => (
        <Button type="primary" shape="circle" icon="environment-o" value={record.id} onClick={this.MapsetClick.bind(this)}/>
      )
    }
  ];
    return(
      <section className="e-body" onClick={this.handleClick} style={{ height: window.innerHeight }}>
        {/* <PageHeader>资源管理</PageHeader> */}
        <div className="my-content" id="my-content1">
        <Layout style={{background: '#fff'}}>
            <Sider id="mysider" width={275} style={{ height: window.innerHeight - 64, background: 'rgb(47, 70, 89)', boxShadow: "1px 0px 6px #dcd0d0", overflow: 'auto', height: window.innerHeight-64, position: 'fixed', left: 0 }}>
                      <Tree onExpand={this.onExpand} onSelect={this.onTreeClick} onRightClick={this.onRightClick} defaultExpandedKeys={localexpandedKeysSet} selectedKeys={this.state.selectedKeysSet}>
                       
                        {this.renderTreeNodes(Data)}
                      </Tree> 
            </Sider>
            <Layout style={{background: '#fff', marginLeft: 275 }}>
              <Content style={{ background: '#fff', margin: 0, minHeight: 280 }}>
              <Affix offsetTop={64}>
              <div className="barpanel-toptoolbar">
                      <Form layout={'inline'}>
                        {this.state.showDevAdd&&this.state.ManaAuth[3]? <FormItem><Button size='default' onClick={this.AddDevice.bind(this,"1")}><Icon type="plus-circle-o"/>音柱添加</Button><Button  style={{marginLeft:"16px"}} onClick={this.showyzadd.bind(this)}  size='default' ><Icon type="plus-circle-o"/>设备批量添加</Button></FormItem>:
                        <FormItem><Button disabled size='default' onClick={this.AddDevice.bind(this,"1")}><Icon type="plus-circle-o"/>音柱添加</Button></FormItem>
}
{this.state.showDevAdd2&&this.state.ManaAuth[3]? <FormItem><Button size='default' onClick={this.AddDevice.bind(this,"2")}><Icon type="plus-circle-o"/>设备添加</Button></FormItem>:
<FormItem><Button size='default' disabled onClick={this.AddDevice.bind(this,"2")}><Icon type="plus-circle-o"/>设备添加</Button></FormItem>
}
                     { this.state.ManaAuth[5]?  <FormItem><Button size='default' onClick={this.DelDevice.bind(this)}><Icon type="close-circle-o" />删除</Button></FormItem>
                     :<FormItem><Button disabled size='default' ><Icon type="close-circle-o" />删除</Button></FormItem>}
                        <FormItem>
                          <Input.Search
                            onChange={this.handleChange.bind(this)}
                            value={serachTxt}
                            size='default' placeholder="名称/逻辑地址"
                            style={{ width: 200}}
                            onSearch={value => this.filterDev(value)}
                          />
                        </FormItem>
                        <FormItem><Button size='default' onClick={this.outputexcel.bind(this)}><Icon type="file-excel" />导出EXCEL</Button> <a href="" download={this.state.downloadname+".xlsx"} id="hf"></a></FormItem>
                      </Form>
                      {/* <Button  style={{    position: "absolute",    right: "24px",    top: "74px"}}  icon="left"   type="primary" onClick={this.clickreback.bind(this)} >返回</Button> */}
                    </div>
                </Affix>
              <div id="myoptable" style={{ padding: "0 24px" }}>
                <Table bordered pagination={{pageSize: 20}} rowSelection={rowSelection} columns={columns} scroll={{ x: 1600 }} dataSource={devicedata} size="middle"/>
                </div>
              </Content>
            </Layout>
          </Layout>
    
    
    
    
          {/* <Row gutter={8}>
            <Col className="gutter-row" md={5}>
              <Row md={24}>
                <div className="gutter-box">
                  <Card noHovering = 'true' title="行政区域" style={{ height: window.innerHeight - 110 }} bodyStyle={{ padding: 5 }}>
                    <div style={{ height: window.innerHeight - 110 - 55 ,overflow:"auto"}}>
                      <Tree onSelect={this.onTreeClick} onRightClick={this.onRightClick}>
                        {this.renderTreeNodes(Data)}
                      </Tree>                  
                    </div>  
                  </Card>
                </div>
              </Row>
            </Col>
            <Col className="gutter-row" md={19}>
              <div className="gutter-box">
                <Card noHovering = 'true' title="终端列表" style={{ height: window.innerHeight - 110}}>
                  <AffixFix offsetTop={64} className="e-content-affix" style={{"height": "44px"}}>
                    <div className="barpanel-toptoolbar">
                      <Form layout={'inline'}>
                        <FormItem><Button size='default' onClick={this.AddDevice.bind(this)}><Icon type="plus-circle-o"/>添加</Button></FormItem>
                        <FormItem><Button size='default' onClick={this.DelDevice.bind(this)}><Icon type="close-circle-o" />删除</Button></FormItem>
                        <FormItem>
                          <Input.Search
                            onChange={this.handleChange.bind(this)}
                            defaultValue={serachTxt}
                            size='default' placeholder="名称/逻辑地址"
                            style={{ width: 200}}
                            onSearch={value => this.update()}
                          />
                        </FormItem>
                      </Form>
                    </div>
                  </AffixFix>
                  <div className="barpanel-content cf">
                  <div className=" clearfix">
                    <div className="" style={{"minHeight":"300px"}}>
                      <Table pagination={{pageSize: 9}} rowSelection={rowSelection} columns={columns} dataSource={devicedata} size="middle"/>
                    </div>
                  </div>
                </div>
                </Card>
              </div>
            </Col>
          </Row> */}
        </div>

        {this.getNodeTreeRightClickMenu()}



         <Modal title={FormTitle}
          visible={visRegForm}
          onOk={this.Regionsubmit}
          confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
          width={520}
        >   
{ this.state.Addshowlogi?          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="逻辑地址"            
          >
          <div className="ipt-fake-box" id="querytag">
            <InputGroup compact style={{height:30}}>
              <Input maxLength="2" style={{ cursor: 'text', color:'#123',width: 50, textAlign: 'center' ,backgroundColor: '#fff',borderRight: 0}} value={logicaddrarr[0]} id = {0} disabled={!logicaddrwritable[0]} onChange={this.Name.bind(this)} onFocus={this.focusnode} onBlur={this.blurnode}/>
              {/* <Input style={{ width: 10, borderLeft: 0,borderRight: 0, backgroundColor: '#fff' }} value="-" disabled /> */}
              <Input maxLength="2" style={{ cursor: 'text',color:'#123',width: 50, textAlign: 'center', borderLeft: 0 ,backgroundColor: '#fff',borderRight: 0}} id = {1} value={logicaddrarr[1]} disabled={!logicaddrwritable[1]} onChange={this.Name.bind(this)} onFocus={this.focusnode} onBlur={this.blurnode}/>
              {/* <Input style={{ width: 10, borderLeft: 0, backgroundColor: '#fff' }} value="-" disabled /> */}
              <Input maxLength="2" style={{ cursor: 'text',color:'#123',width: 50, textAlign: 'center', borderLeft: 0,backgroundColor: '#fff',borderRight: 0}} id = {2} value={logicaddrarr[2]} disabled={!logicaddrwritable[2]} onChange={this.Name.bind(this)} onFocus={this.focusnode} onBlur={this.blurnode}/>
              {/* <Input style={{ width: 10, borderLeft: 0,borderRight: 0, backgroundColor: '#fff' }} value="-" disabled /> */}
              <Input maxLength="3" style={{ cursor: 'text',color:'#123', width: 50, textAlign: 'center', borderLeft: 0 ,backgroundColor: '#fff',borderRight: 0}} id = {3} value={logicaddrarr[3]} disabled={!logicaddrwritable[3]} onChange={this.Name.bind(this)} onFocus={this.focusnode} onBlur={this.blurnode}/>
              {/* <Input style={{ width: 10, borderLeft: 0,borderRight: 0, backgroundColor: '#fff' }} value="-" disabled /> */}
              <Input maxLength="3" style={{ cursor: 'text',color:'#123',width: 50, textAlign: 'center', borderLeft: 0 ,backgroundColor: '#fff',borderRight: 0}} id = {4} value={logicaddrarr[4]} disabled={!logicaddrwritable[4]} onChange={this.Name.bind(this)} onFocus={this.focusnode} onBlur={this.blurnode}/>
              {/* <Input style={{ width: 10, borderLeft: 0,borderRight: 0, backgroundColor: '#fff' }} value="-" disabled /> */}
              <Input maxLength="2" style={{ cursor: 'text',color:'#123',width: 50, textAlign: 'center', borderLeft: 0 ,backgroundColor: '#fff'}} id = {5} value={logicaddrarr[5]} disabled={!logicaddrwritable[5]} onChange={this.Name.bind(this)} onFocus={this.focusnode} onBlur={this.blurnode}/>
            </InputGroup>
            <style>{`
            .focus input {
               border-color: #49a9ee;
               borderLeft: 0;
               borderRight: 0;
            }
            `}</style>
           </div>
          </FormItem>:
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="逻辑地址"            
          >
          <div className="ipt-fake-box" id="querytag">
            <InputGroup compact style={{height:30}}>
              <Input maxLength="2" style={{ cursor: 'text', color:'#123',width: 50, textAlign: 'center' ,backgroundColor: '#fff',borderRight: 0}} value={logicaddrarr1[0]} id = {0} disabled onChange={this.Name.bind(this)} onFocus={this.focusnode} onBlur={this.blurnode}/>
              {/* <Input style={{ width: 10, borderLeft: 0,borderRight: 0, backgroundColor: '#fff' }} value="-" disabled /> */}
              <Input maxLength="2" style={{ cursor: 'text',color:'#123',width: 50, textAlign: 'center', borderLeft: 0 ,backgroundColor: '#fff',borderRight: 0}} id = {1} value={logicaddrarr1[1]} disabled onChange={this.Name.bind(this)} onFocus={this.focusnode} onBlur={this.blurnode}/>
              {/* <Input style={{ width: 10, borderLeft: 0, backgroundColor: '#fff' }} value="-" disabled /> */}
              <Input maxLength="2" style={{ cursor: 'text',color:'#123',width: 50, textAlign: 'center', borderLeft: 0,backgroundColor: '#fff',borderRight: 0}} id = {2} value={logicaddrarr1[2]} disabled onChange={this.Name.bind(this)} onFocus={this.focusnode} onBlur={this.blurnode}/>
              {/* <Input style={{ width: 10, borderLeft: 0,borderRight: 0, backgroundColor: '#fff' }} value="-" disabled /> */}
              <Input maxLength="3" style={{ cursor: 'text',color:'#123', width: 50, textAlign: 'center', borderLeft: 0 ,backgroundColor: '#fff',borderRight: 0}} id = {3} value={logicaddrarr1[3]} disabled onChange={this.Name.bind(this)} onFocus={this.focusnode} onBlur={this.blurnode}/>
              {/* <Input style={{ width: 10, borderLeft: 0,borderRight: 0, backgroundColor: '#fff' }} value="-" disabled /> */}
              <Input maxLength="3" style={{ cursor: 'text',color:'#123',width: 50, textAlign: 'center', borderLeft: 0 ,backgroundColor: '#fff',borderRight: 0}} id = {4} value={logicaddrarr1[4]} disabled onChange={this.Name.bind(this)} onFocus={this.focusnode} onBlur={this.blurnode}/>
              {/* <Input style={{ width: 10, borderLeft: 0,borderRight: 0, backgroundColor: '#fff' }} value="-" disabled /> */}
              <Input maxLength="2" style={{ cursor: 'text',color:'#123',width: 50, textAlign: 'center', borderLeft: 0 ,backgroundColor: '#fff'}} id = {5} value={logicaddrarr1[5]} disabled onChange={this.Name.bind(this)} onFocus={this.focusnode} onBlur={this.blurnode}/>
            </InputGroup>
            <style>{`
            .focus input {
               border-color: #49a9ee;
               borderLeft: 0;
               borderRight: 0;
            }
            `}</style>
           </div>
          </FormItem>
          }
    {this.state.Addshowlogi?  null 
  :
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="设备类型"            
          >
          <Select value={this.state.DevType} onChange={this.Name6.bind(this)} style={{ width: 300}}>
            <Option value="2">多路语音合成器</Option>
            <Option value="3">电话短信网关</Option>
            <Option value="4">数字编码控制器</Option>
            <Option value="5">播出控制器</Option>
          </Select>
          </FormItem>
          }
          {/* { this.state.regiontag?   <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="物理地址"            
          >
          <div className="ipt-fake-box" id="querytag">
            <InputGroup compact style={{height:30}}>
              <Input maxLength="2" style={{ cursor: 'text', color:'#123',width: 50, textAlign: 'center' ,backgroundColor: '#fff',borderRight: 0}} value={phyaddrarr[0]} id = {0} disabled  onFocus={this.focusnode} onBlur={this.blurnode}/>

              <Input maxLength="2" style={{ cursor: 'text',color:'#123',width: 50, textAlign: 'center', borderLeft: 0 ,backgroundColor: '#fff',borderRight: 0}} id = {1} value={phyaddrarr[1]} disabled  onFocus={this.focusnode} onBlur={this.blurnode}/>

              <Input maxLength="2" style={{ cursor: 'text',color:'#123',width: 50, textAlign: 'center', borderLeft: 0,backgroundColor: '#fff',borderRight: 0}} id = {2} value={phyaddrarr[2]} disabled={false} onChange={this.Namephy.bind(this)} onFocus={this.focusnode} onBlur={this.blurnode}/>

              <Input maxLength="2" style={{ cursor: 'text',color:'#123', width: 50, textAlign: 'center', borderLeft: 0 ,backgroundColor: '#fff',borderRight: 0}} id = {3} value={phyaddrarr[3]} disabled={false} onChange={this.Namephy.bind(this)} onFocus={this.focusnode} onBlur={this.blurnode}/>
  
              <Input maxLength="2" style={{ cursor: 'text',color:'#123',width: 50, textAlign: 'center', borderLeft: 0 ,backgroundColor: '#fff',borderRight: 0}} id = {4} value={phyaddrarr[4]} disabled={false} onChange={this.Namephy.bind(this)} onFocus={this.focusnode} onBlur={this.blurnode}/>

              <Input maxLength="2" style={{ cursor: 'text',color:'#123',width: 50, textAlign: 'center', borderLeft: 0 ,backgroundColor: '#fff'}} id = {5} value={phyaddrarr[5]} disabled={false} onChange={this.Namephy.bind(this)} onFocus={this.focusnode} onBlur={this.blurnode}/>
            </InputGroup>
            <style>{`
            .focus input {
               border-color: #49a9ee;
               borderLeft: 0;
               borderRight: 0;
            }
            `}</style>
           </div>
          </FormItem>:null
          } */}
           <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="名称"
          >
            <Input id="subname" value={this.state.modifyName} onChange={this.Name1.bind(this)} style={{color:'#123',width:300,height:28}}/>
          </FormItem>
{ this.state.regiontag?     (<div>   
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="网管IP地址"
            hasFeedback
              validateStatus={this.isValidIP(this.state.ipaddr)||!this.state.ensnmp?"success":"error"}
          >
            <Input id="ipaddr" value={this.state.ipaddr} onChange={this.Name2.bind(this)} style={{color:'#123',width:300,height:28}}/>
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="读社区串"
          >
            <Input id="ReadStr" value={this.state.ReadStr} onChange={this.Name3.bind(this)} style={{color:'#123',width:300,height:28}}/>
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="写社区串"
          >
            <Input id="WriteStr" value={this.state.WriteStr} onChange={this.Name4.bind(this)} style={{color:'#123',width:300,height:28}}/>
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="snmp版本"
          >
          <Select value={this.state.SnmpVer} onChange={this.Name5.bind(this)} style={{ width: 300}}>
            <Option value="1">SnmpVer1</Option>
            <Option value="2">SnmpVer2</Option>
          </Select>


            {/* <Input id="SnmpVer" value={this.state.SnmpVer} onChange={this.Name5.bind(this)} style={{color:'#123',width:300,height:28}}/> */}
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="是否可网管"
          >
          <Switch checked={this.state.ensnmp} onChange={this.ensnmponChange.bind(this)} />,
          </FormItem></div>):null}
        </Modal>







        <Modal
          title="地图设置"
          visible={MapsetVisable}
          onOk={this.MapsethandleOk.bind(this)}
          onCancel={this.MapsethandleCancel.bind(this)}
          width={800}
          style={{ top: 20 }}
          bodyStyle={{padding:0}}
          okText="保存"
          cancelText="取消"
        >
              <div style={{width:"100%",height:"500px"}}>
                  <Mapbox store1={this.store1}  store={this.store} MapRowId={this.state.MapRowId} Devicedata={this.state.devicedata}/>

              </div>
        </Modal>


        <Modal
          title="设备批量添加"
          visible={yzaddVisable}
          onOk={this.yzaddhandleOk.bind(this)}
          onCancel={this.yzaddhandleCancel.bind(this)}
          width={1000}
          style={{ top: 20 }}
          bodyStyle={{padding:0}}
          okText="开始导入"
          cancelText="离开"
        >
              <div style={{height:"600px",margin:"10px"}}>
                    <a href="javascript:;" className="file">选择文件
                        <input ref="inputfile" type="file" onChange={this.importf.bind(this)}  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>
                    </a>
                      {this.renderyzaddtable(this.state.yzaddsheetdata)}
              </div>
        </Modal>


        <Modal title={"修改"}
          visible={this.state.editvisable}
          onOk={this.Regionsubmitedit.bind(this)}
          confirmLoading={confirmLoading}
          onCancel={this.handleCanceledit}
          width={520}
        >
{  this.state.Addshowlogiedit?        <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="逻辑地址"            
          >
          <div className="ipt-fake-box" id="querytag">
            <InputGroup compact style={{height:30}}>
              <Input maxLength="2" style={{ cursor: 'text', color:'#123',width: 50, textAlign: 'center' ,backgroundColor: '#fff',borderRight: 0}} value={logicaddrarredit[0]} id = {0} disabled onChange={this.Name.bind(this)} onFocus={this.focusnode} onBlur={this.blurnode}/>
              {/* <Input style={{ width: 10, borderLeft: 0,borderRight: 0, backgroundColor: '#fff' }} value="-" disabled /> */}
              <Input maxLength="2" style={{ cursor: 'text',color:'#123',width: 50, textAlign: 'center', borderLeft: 0 ,backgroundColor: '#fff',borderRight: 0}} id = {1} value={logicaddrarredit[1]} disabled onChange={this.Name.bind(this)} onFocus={this.focusnode} onBlur={this.blurnode}/>
              {/* <Input style={{ width: 10, borderLeft: 0, backgroundColor: '#fff' }} value="-" disabled /> */}
              <Input maxLength="2" style={{ cursor: 'text',color:'#123',width: 50, textAlign: 'center', borderLeft: 0,backgroundColor: '#fff',borderRight: 0}} id = {2} value={logicaddrarredit[2]} disabled onChange={this.Name.bind(this)} onFocus={this.focusnode} onBlur={this.blurnode}/>
              {/* <Input style={{ width: 10, borderLeft: 0,borderRight: 0, backgroundColor: '#fff' }} value="-" disabled /> */}
              <Input maxLength="2" style={{ cursor: 'text',color:'#123', width: 50, textAlign: 'center', borderLeft: 0 ,backgroundColor: '#fff',borderRight: 0}} id = {3} value={logicaddrarredit[3]} disabled onChange={this.Name.bind(this)} onFocus={this.focusnode} onBlur={this.blurnode}/>
              {/* <Input style={{ width: 10, borderLeft: 0,borderRight: 0, backgroundColor: '#fff' }} value="-" disabled /> */}
              <Input maxLength="2" style={{ cursor: 'text',color:'#123',width: 50, textAlign: 'center', borderLeft: 0 ,backgroundColor: '#fff',borderRight: 0}} id = {4} value={logicaddrarredit[4]} disabled onChange={this.Name.bind(this)} onFocus={this.focusnode} onBlur={this.blurnode}/>
              {/* <Input style={{ width: 10, borderLeft: 0,borderRight: 0, backgroundColor: '#fff' }} value="-" disabled /> */}
              <Input maxLength="2" style={{ cursor: 'text',color:'#123',width: 50, textAlign: 'center', borderLeft: 0 ,backgroundColor: '#fff'}} id = {5} value={logicaddrarredit[5]} disabled={false} onChange={this.Nameedit.bind(this)} onFocus={this.focusnode} onBlur={this.blurnode}/>
            </InputGroup>
            <style>{`
            .focus input {
               border-color: #49a9ee;
               borderLeft: 0;
               borderRight: 0;
            }
            `}</style>
           </div>
          </FormItem>:
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="逻辑地址"            
          >
          <div className="ipt-fake-box" id="querytag">
            <InputGroup compact style={{height:30}}>
              <Input maxLength="2" style={{ cursor: 'text', color:'#123',width: 50, textAlign: 'center' ,backgroundColor: '#fff',borderRight: 0}} value={logicaddrarredit1[0]} id = {0} disabled onChange={this.Name.bind(this)} onFocus={this.focusnode} onBlur={this.blurnode}/>
              {/* <Input style={{ width: 10, borderLeft: 0,borderRight: 0, backgroundColor: '#fff' }} value="-" disabled /> */}
              <Input maxLength="2" style={{ cursor: 'text',color:'#123',width: 50, textAlign: 'center', borderLeft: 0 ,backgroundColor: '#fff',borderRight: 0}} id = {1} value={logicaddrarredit1[1]} disabled onChange={this.Name.bind(this)} onFocus={this.focusnode} onBlur={this.blurnode}/>
              {/* <Input style={{ width: 10, borderLeft: 0, backgroundColor: '#fff' }} value="-" disabled /> */}
              <Input maxLength="2" style={{ cursor: 'text',color:'#123',width: 50, textAlign: 'center', borderLeft: 0,backgroundColor: '#fff',borderRight: 0}} id = {2} value={logicaddrarredit1[2]} disabled onChange={this.Name.bind(this)} onFocus={this.focusnode} onBlur={this.blurnode}/>
              {/* <Input style={{ width: 10, borderLeft: 0,borderRight: 0, backgroundColor: '#fff' }} value="-" disabled /> */}
              <Input maxLength="2" style={{ cursor: 'text',color:'#123', width: 50, textAlign: 'center', borderLeft: 0 ,backgroundColor: '#fff',borderRight: 0}} id = {3} value={logicaddrarredit1[3]} disabled onChange={this.Name.bind(this)} onFocus={this.focusnode} onBlur={this.blurnode}/>
              {/* <Input style={{ width: 10, borderLeft: 0,borderRight: 0, backgroundColor: '#fff' }} value="-" disabled /> */}
              <Input maxLength="2" style={{ cursor: 'text',color:'#123',width: 50, textAlign: 'center', borderLeft: 0 ,backgroundColor: '#fff',borderRight: 0}} id = {4} value={logicaddrarredit1[4]} disabled onChange={this.Name.bind(this)} onFocus={this.focusnode} onBlur={this.blurnode}/>
              {/* <Input style={{ width: 10, borderLeft: 0,borderRight: 0, backgroundColor: '#fff' }} value="-" disabled /> */}
              <Input maxLength="2" style={{ cursor: 'text',color:'#123',width: 50, textAlign: 'center', borderLeft: 0 ,backgroundColor: '#fff'}} id = {5} value={logicaddrarredit1[5]} disabled onChange={this.Nameedit.bind(this)} onFocus={this.focusnode} onBlur={this.blurnode}/>
            </InputGroup>
            <style>{`
            .focus input {
               border-color: #49a9ee;
               borderLeft: 0;
               borderRight: 0;
            }
            `}</style>
           </div>
          </FormItem>}
          {/* <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="物理地址"            
          >
          <div className="ipt-fake-box" id="querytag">
            <InputGroup compact style={{height:30}}>
              <Input maxLength="2" style={{ cursor: 'text', color:'#123',width: 50, textAlign: 'center' ,backgroundColor: '#fff',borderRight: 0}} value={phyaddrarredit[0]} id = {0} disabled  onFocus={this.focusnode} onBlur={this.blurnode}/>
              <Input maxLength="2" style={{ cursor: 'text',color:'#123',width: 50, textAlign: 'center', borderLeft: 0 ,backgroundColor: '#fff',borderRight: 0}} id = {1} value={phyaddrarredit[1]} disabled  onFocus={this.focusnode} onBlur={this.blurnode}/>
              <Input maxLength="2" style={{ cursor: 'text',color:'#123',width: 50, textAlign: 'center', borderLeft: 0,backgroundColor: '#fff',borderRight: 0}} id = {2} value={phyaddrarredit[2]} disabled={false} onChange={this.Namephyedit.bind(this)} onFocus={this.focusnode} onBlur={this.blurnode}/>
              <Input maxLength="2" style={{ cursor: 'text',color:'#123', width: 50, textAlign: 'center', borderLeft: 0 ,backgroundColor: '#fff',borderRight: 0}} id = {3} value={phyaddrarredit[3]} disabled={false} onChange={this.Namephyedit.bind(this)} onFocus={this.focusnode} onBlur={this.blurnode}/>
              <Input maxLength="2" style={{ cursor: 'text',color:'#123',width: 50, textAlign: 'center', borderLeft: 0 ,backgroundColor: '#fff',borderRight: 0}} id = {4} value={phyaddrarredit[4]} disabled={false} onChange={this.Namephyedit.bind(this)} onFocus={this.focusnode} onBlur={this.blurnode}/>
              <Input maxLength="2" style={{ cursor: 'text',color:'#123',width: 50, textAlign: 'center', borderLeft: 0 ,backgroundColor: '#fff'}} id = {5} value={phyaddrarredit[5]} disabled={false} onChange={this.Namephyedit.bind(this)} onFocus={this.focusnode} onBlur={this.blurnode}/>
            </InputGroup>
            <style>{`
            .focus input {
               border-color: #49a9ee;
               borderLeft: 0;
               borderRight: 0;
            }
            `}</style>
           </div>
          </FormItem> */}




    {this.state.Addshowlogiedit?    null :
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="设备类型"            
          >
          <Select value={this.state.DevTypeedit} onChange={this.Name6edit.bind(this)} style={{ width: 300}}>
            <Option value="2">多路语音合成器</Option>
            <Option value="3">电话短信网关</Option>
            <Option value="4">数字编码控制器</Option>
            <Option value="5">播出控制器</Option>
          </Select>
          </FormItem>
          }
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="名称"
            hasFeedback
            validateStatus={this.state.modifyNameedit!=""?"success":"error"}
          >
            <Input id="subname" value={this.state.modifyNameedit} onChange={this.Name1edit.bind(this)} style={{color:'#123',width:300,height:28}}/>
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="网管IP地址"
            hasFeedback
              validateStatus={this.isValidIP(this.state.ipaddredit)||!this.state.ensnmpedit?"success":"error"}
          >
            <Input id="ipaddr" value={this.state.ipaddredit} onChange={this.Name2edit.bind(this)} style={{color:'#123',width:300,height:28}}/>
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="读社区串"
            hasFeedback
              validateStatus={this.state.ReadStredit!=""?"success":"error"}
          >
            <Input id="ReadStr" value={this.state.ReadStredit} onChange={this.Name3edit.bind(this)} style={{color:'#123',width:300,height:28}}/>
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="写社区串"
            hasFeedback
              validateStatus={this.state.WriteStredit!=""?"success":"error"}
          >
            <Input id="WriteStr" value={this.state.WriteStredit} onChange={this.Name4edit.bind(this)} style={{color:'#123',width:300,height:28}}/>
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="snmp版本"
          >
          <Select value={this.state.SnmpVeredit} onChange={this.Name5edit.bind(this)} style={{ width: 300}}>
            <Option value="1">SnmpVer1</Option>
            <Option value="2">SnmpVer2</Option>
          </Select>


            {/* <Input id="SnmpVer" value={this.state.SnmpVer} onChange={this.Name5.bind(this)} style={{color:'#123',width:300,height:28}}/> */}
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="是否可网管"
          >
          <Switch checked={this.state.ensnmpedit} onChange={this.ensnmponChangeedit.bind(this)} />,
          </FormItem>
        </Modal>



        <style>{`
          .ant-card-body {
            padding:0px;
          }
          .barpanel-toptoolbar{
            padding-bottom: 3px;     
            background: #fff;       
          } 
          .gutter-box {
            padding:3px 0;
          }
          {/* .my-content{
            margin-right: 24px; 
            margin-left: 24px; 
          } */}
          .tableListOperator{
            margin-bottom: 16px; 
          } 
          .tableListOperator button{
            margin-right: 8px; 
          }   
          .mypopdiv{
                        height:100%;
                        width:200px;
                        word-wrap: break-word;
                    }
                    #myoptable .ant-table-tbody>tr>td, #myoptable .ant-table-thead>tr>th {
                        padding: 10px 8px;
                        word-break: break-all;
                    }    


         .colcenter{
          text-align: center !important;
         }  

         .cyan {
            color: #13c2c2;
            background: #e6fffb;
            border-color: #87e8de;
        }  
        .blue {
            color: #1890ff;
            background: #e6f7ff;
            border-color: #91d5ff;
        }     
        .green {
          color: #52c41a;
          background: #f6ffed;
          border-color: #b7eb8f;
         } 
         .lime {
    color: #a0d911;
    background: #fcffe6;
    border-color: #eaff8f;
}
.magenta {
    color: #eb2f96;
    background: #fff0f6;
    border-color: #ffadd2;
} 
        `}
        </style>

        <style>{`
                 .ant-tree-title {
                        {/* font-size: 14px; */}
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



                    .file {
    position: relative;
    display: inline-block;
    background: #D0EEFF;
    border: 1px solid #99D3F5;
    border-radius: 4px;
    padding: 4px 12px;
    overflow: hidden;
    color: #1E88C7;
    text-decoration: none;
    text-indent: 0;
    line-height: 20px;
}
.file input {
    position: absolute;
    font-size: 100px;
    right: 0;
    top: 0;
    opacity: 0;
}
.file:hover {
    background: #AADFFD;
    border-color: #78C3F3;
    color: #004974;
    text-decoration: none;
}

#my-content1 ul.ant-tree{
  padding-bottom:100px;
}

                    `}</style>
      </section>
      )
  }
}

)