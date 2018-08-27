import React from 'react';
import { Form, Layout, Tooltip, Spin } from 'antd';
import createStore from '../createStore';
import { withRouter } from 'react-router'

import AdvancedSearchForm from './AdvancedSearchForm'
//import SortTable from './SortTable';
import DetailTable from './DetailTable'
import Treeview from './treeview'

import PageMain from '../../components/pagemain.jsx'
import { netdata } from './../../helper'
import Png from './refresh.png';
import Mapbox from './map'
const { Sider } = Layout;
let chlDIC = [];
let MP3data =[];
var LiveCfgForm = Form.create({
  onValuesChange(props, values) {
    let type, value;
    for (var dd in values) {
      type = dd;
      value = values[dd];
    }
    switch (type) {
      case "BroadType":
        let text, typetext;
        switch (value) {
          case '1': text = "文件广播"
            typetext = ""
            break;
          case '2': text = "设备广播"
            typetext = "线路一"
            break;
          case '3': text = "短讯广播"
            typetext = ""
            break;
          case '4': text = "图片广播"
            break;
          case '5': text = "网络广播"
            typetext = ""
            break;
        }
        document.getElementById("filename").innerHTML = text;
        document.getElementById("typename").innerHTML = typetext;
        break;
      case "Vol":
        document.getElementById("volvalue").innerHTML = "音量：" + value;
        break;
      case "FileName":
        // let text1;
        // switch (value) {
        //   case 'pth.mp3': text1 = "普通话"
        //     break;
        //   case 'kz.mp3': text1 = "男生"
        //     break;
        //   case 'ns.mp3': text1 = "女生"
        //     break;
        // }
          let txtValue = MP3data!=[]?MP3data.filter(a=>a.id==value)[0].Name:"请选择";

        document.getElementById("typename").innerHTML = txtValue.length>3?txtValue.substring(0,2)+"..":txtValue;
        break;
      case "ChannelSelect":
        let text2;
        switch (value) {
          case '0': text2 = "线路一"
            break;
          case '1': text2 = "线路二"
            break;
          case '2': text2 = "话筒"
            break;
          case '3': text2 = "MP3"
            break;
        }
        document.getElementById("typename").innerHTML = text2;
        break;
      case "NewsLevel":
        let text3;
        switch (value) {
          case '6': text3 = "一般"
            break;
          case '7': text3 = "较大"
            break;
          case '8': text3 = "重大"
            break;
          case '9': text3 = "特重大"
            break;
        }
        document.getElementById("news").innerHTML = text3;
        break;
        case "newscontent":
        document.getElementById("typename").innerHTML = value.length>3?value.substring(0, 2) + "..":value;
        break;
        case "broadchl":
        document.getElementById("typename").innerHTML = chlDIC[value].length>3?chlDIC[value].substring(0,2)+"..":chlDIC[value];
        break;
    }
  },
})(AdvancedSearchForm);
const LiveBroad=  withRouter(class LiveBroad extends React.Component {
  constructor(props) {
    super(props);
    // 初始化 store
    this.store = createStore({
      checkedKeystore: [],
      markerinfostore:[],
      lineinfo:false,
      alarm:false,
      linechange:false,
      lineid:"",
      infoids:[],
      livelistsource: [],
      rootlogicaddr: "",
      markerDic:[],
      clearlayer:false
    });
  }
  state = {
    playervisible: false,
    tablescroll: 134,
    listsourcedata: [],
    audiosrc: "a=url.com",
    loading: false,
    collapsed: true,
    livesrc: "",
    MP3List:[],
     playerID:"",
     devicelatlng:"",
     devicetitle:"",
     deviceinfo:"",
     bottomheight:155,
     userAuthadd:true,
     userAuthdelete:true,
     userAuthmodify:true,
  };
  addClass(obj, cls) {
    if (!this.hasClass(obj, cls)) obj.className += " " + cls;
  }

  removeClass(obj, cls) {
    if (this.hasClass(obj, cls)) {
      var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
      obj.className = obj.className.replace(reg, ' ');
    }
  }
  toggleClass(obj, cls) {
    if (this.hasClass(obj, cls)) {
      this.removeClass(obj, cls);
    } else {
      this.addClass(obj, cls);
    }
  }
  hasClass(obj, cls) {
    return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
  }

  reloadtable() {
    this.setState({ loading: true });
    var that = this;
    let r = {
      method: "POST",
      body: JSON.stringify({ "opt": "GetBroadcast" })
    }
    netdata('/BroadcastOpt.epy', r).then(
      that.ondatatable.bind(that)
    )
  }
  authInit(Authtype){
    for(let i=0;i<Authtype.length;i++){
      if(Authtype[i]=='20'||Authtype[i]=='-1'){
        return;
      }
    }
    let tag=[false,false,false]
    for(let i=0;i<Authtype.length;i++){
      if(Authtype[i]=='21'){
        tag[0]=true;
      }else if(Authtype[i]=='22'){
        tag[1]=true;
      }
      else if(Authtype[i]=='23'){
        tag[2]=true;
      }
    }
    this.setState({userAuthadd:tag[0],userAuthdelete:tag[1],userAuthmodify:tag[2]})
  }


  componentWillMount(){
     let Authtype=localStorage.Auth.split(',');
     if(localStorage.UserID!=-1)
     {this.authInit(Authtype);}
     let localCheckedKeys= localStorage.checkedKeysIndex.split(',');
     this.store.setState({checkedKeystore:localCheckedKeys})
  }
  componentDidMount() {
    let that =this;
    if(localStorage.collapsedIndex =="true"){
      this.setState({collapsed:true})
  }else{
    this.setState({collapsed:false})
  }

  if(this.hasClass(document.body, "show-menu-bottom")){
    let btnt = document.getElementById("open-button-bottom");
    this.removeClass(btnt, "anticon-up");
    this.addClass(btnt, "anticon-down")
  }
  else{
    let btnt1 = document.getElementById("open-button-bottom");
    this.removeClass(btnt1, "anticon-down");
    this.addClass(btnt1, "anticon-up")
  }
  //resize

  var oDiv=document.getElementById('bottomresize');
  var mytable =document.getElementById('mytable');

  oDiv.onmousedown=function(ev){
    var disX=ev.clientX-oDiv.offsetLeft
    var disY=ev.clientY-oDiv.offsetTop
  let height=that.state.bottomheight;
    document.onmousemove=function(ev){
      var l=ev.clientX-disX
      var t=disY-ev.clientY 
    if((height+t)<=400&&(height+t)>=155){
        that.setState({bottomheight:height+t})
    } 
      // oDiv.style.left=l+'px'
      // oDiv.style.top=t+'px'
    }
    document.onmouseup=function(){
      document.onmousemove=null;
      document.onmouseup=null
    }
  }


    this.reloadtable();
    var bodyEl = document.body,
      openbtn = document.getElementById('expand-button'),
      openbtnbottom = document.getElementById('open-button-div'),
      reloadbtn = document.getElementById('open-button-reload'),
      closebtn = document.getElementById('close-button'),
      deviceclosebtn=document.getElementById('deviceclosebtn'),
      isOpen = false;
    reloadbtn.addEventListener('click', function () {
      that.reloadtable();
    });
    openbtn.addEventListener('click', function () {
      let iconchange = document.getElementById("expand-button-icon");
      that.toggleClass(document.body, "show-menu");
      that.toggleClass(document.getElementById("layerbox"), "myshadow")
      if (that.hasClass(iconchange, "anticon-arrows-alt")) {
        that.removeClass(iconchange, "anticon-arrows-alt");
        that.addClass(iconchange, "anticon-shrink")
      }
      else {
        that.removeClass(iconchange, "anticon-shrink");
        that.addClass(iconchange, "anticon-arrows-alt")
      }
    });
    openbtnbottom.addEventListener('click', function () {
      that.toggleClass(document.body, "show-menu-bottom");
      let btntag = document.getElementById("open-button-bottom");

      if (that.hasClass(btntag, "anticon-up")) {
        that.removeClass(btntag, "anticon-up");
        that.addClass(btntag, "anticon-down")
      }
      else {
        that.removeClass(btntag, "anticon-down");
        that.addClass(btntag, "anticon-up")
      }
    });
    deviceclosebtn.addEventListener('click',function(){
      that.toggleClass(document.getElementById("deviceInfobox"), "close");
    })
    window.onresize = function(){
      var height = (window.innerHeight - 64) + "px";
      var height1 = (window.innerHeight) + "px";

      try {
        var width = that.state.collapsed ? window.innerWidth + "px" : window.innerWidth - 275 + "px";
        var width1 = that.state.collapsed ? window.innerWidth-180 + "px" : window.innerWidth-180 - 275 + "px";
        document.getElementById('resizediv1').style.height = height;
        document.getElementById('resizediv2').style.height = height;
        document.getElementById('myebody').style.height = height1;
        document.getElementById('mytable').style.width = width;
        document.getElementById('menu-button-in').style.marginLeft=width1
      } catch (error) {

      }
    };
    // $(window).unbind('resize', this.resizewindow);
    let r = {
      method: "POST",
      body: JSON.stringify({ "opt": "getBroadcastChlList" })
    }
    netdata('/BroadcastChlOpt.epy', r).then(that.ondataChlList.bind(this));

      // r = {
      //     method: "POST",
      //     body: JSON.stringify({"opt":"getMp3FileList"})
      // }
      // netdata('/MP3FileOpt.epy', r).then(this.ondataMp3List.bind(this));
       r = {
        method: "POST",
        body: JSON.stringify({"opt":"getFileListTable"})
      }
      netdata('/FileListOpt.epy', r).then(this.onfiletabledata.bind(this))       
  };
  componentWillUnmount () {  
    window.onresize= function(){}
  }
  onfiletabledata(res) {
    if(res.d.errCode === "Cookie过期"){
      this.props.history.replace('/power')
    }
      let Vdata = [];
      if (res.d.errCode == 0) {
          let Vs = res.d.Values;
          for (let i = 0; i < Vs.length; i++) {
              Vs[i]['key'] = Vs[i].id;
              Vdata.push(Vs[i]);
          }
          Vdata.sort(function (a, b) {
              return b.key - a.key
          });

          MP3data = Vdata;
          this.setState({MP3List: Vdata});
      }
  }
  // ondataMp3List(res) {
  //   if(res.d.errCode === "Cookie过期"){
  //     this.props.history.replace('/power')
  //   }
  //     let Vdata = [];
  //     if (res.d.errCode == 0) {
  //         let Vs = res.d.Values;
  //         for (let i = 0; i < Vs.length; i++) {
  //             Vs[i]['key'] = Vs[i].id;
  //             Vdata.push(Vs[i]);
  //         }
  //         Vdata.sort(function (a, b) {
  //             return b.key - a.key
  //         });

  //         MP3data = Vdata;
  //         this.setState({MP3List: Vdata});
  //     }
  // }
  ondataChlList(res) {
    if(res.d.errCode === "Cookie过期"){
      this.props.history.replace('/power')
    }
    if (res.s === false) {
      Notification['error']({
        message: '数据请求错误',
        description: JSON.stringify(res.d),
      });
      return;
    }
    if (res.d.errCode == 0) {
      let broadCastData = res.d.Values;
      for (let i = 0; i < broadCastData.length; i++) {
        chlDIC[broadCastData[i].id] = broadCastData[i].Name;
      }
    }
  }
  loadingfalse() {
    this.setState({ loading: false });
  }
  ondatatable(res) {
    if(res.d.errCode === "Cookie过期"){
      this.props.history.replace('/power')
    }
    if (res.d.errCode == 0) {
      let data =res.d.Values;
      if(data!==[]){
          let en = true;
          for(let i= 0;i<data.length;i++){           
            if(typeof(data[i].Index)!=="undefined"){
              if(data[i].Index==this.state.playerID){
                en=false;
              }
            }
          }
          if(en){
            try {
              document.getElementById("playershow").setAttribute("class","");
            this.setState({livesrc:""})
            } catch (error) {
              
            }
            
          }
      }
      let infoids=[];
      for(let i=0;i<data.length;i++){
        infoids.push(data[i].Index)
      }
     

      this.store.setState({ livelistsource: res.d.Values,infoids:infoids ,linechange:true});
      setTimeout(this.loadingfalse.bind(this), 100);
    }
    else {

    }
  }
  setSet(obj) {
    this.setState(obj);
  }
  onChildChanged = (newState) => {
    this.setState({
      tablescroll: newState
    });
  };
  changedeviceinfo(){
    console.log(23213)
  }
  render() {
    const { playervisible } = this.state
    return (
      <section id="myebody" className="e-body" style={{ height: window.innerHeight }}>
        {/* <PageHeader>实时广播</PageHeader> */}
          <div className="my-content">
          <Layout>
            <Sider width={275} className="mysider" id="mysider" defaultCollapsed={true} collapsed={this.state.collapsed} collapsible={true} collapsedWidth={0} onCollapse={(collapsed, type) => { this.setState({ collapsed: collapsed });localStorage.collapsedIndex =collapsed; document.getElementById('mytable').removeAttribute('style'); document.getElementById('menu-button-in').removeAttribute('style') }}>
              <div className="gutter-box" >
                {/* <Card noHovering style={{ height: window.innerHeight - 64 }} bodyStyle={{ padding: 0 }} > */}
                <div id="resizediv1" style={{ height: window.innerHeight - 64, overflow: "auto", backgroundColor: '#fff' }}>
                  <Treeview store={this.store} setSet={this.setSet.bind(this)}/>
                </div>
                {/* </Card> */}
              </div>
            </Sider>
            <Layout style={{ overflow: "hidden" }}>
              {/* <Content> */}
              <div className="gutter-box" id="gutter-box" style={{ position: 'relative' }}>
                <div id="resizediv2" style={{ height: window.innerHeight - 64 }}>
                  <Mapbox store={this.store} />
                </div>
                <div className="menu-wrap" style={{ display:this.state.userAuthadd?"":"none" }}>
                  <nav className="menu">
                    {/* <div className="profile" style={{ "color": "#2db7f5" }}><span>创建广播</span></div> */}
                    <div className="link-list" id="formstyle">
                      <LiveCfgForm
                        callbackParent={this.onChildChanged}
                        OnReload={this.reloadtable.bind(this)}
                        store={this.store}
                        wrappedComponentRef={(inst) => this.formRef = inst}
                        MP3data ={this.state.MP3List}
                      />
                    </div>
                  </nav>
                </div>
                {/* <button className="menu-button" id="open-button"><a className="anticon anticon-plus-circle " /></button> */}
                {/* <div id="searchbox" className="clearfix">
                  <div id="searchbox-container">
                    <div id="sole-searchbox-content" className="searchbox-content">
                      <input id="sole-input" className="searchbox-content-common" type="text"  placeholder="设置广播选项" value="" />
                      <div className="searchbox-content-button right-button route-button loading-button"></div>
                    </div>
                  </div>
                  <button id="search-button" onClick={(e)=>this.formRef.submitlivedata(e) }>
                  </button>
                </div> */}
              
                <div key="layerbox" id="layerbox" className="layerbox usel" style={{ top: '15px',display:this.state.userAuthadd?"":"none" }}>
                  {/* <div className="tooldragbar tooldragup">
                    </div>
                    <div className="tooldragbar tooldragdown">
                    </div>
                    <div className="tooldragbar tooldragleft">
                    </div>
                    <div className="tooldragbar tooldragright">
                    </div> */}
              <div id="layerbox_item">
                    <div className="show-list">
                      <Tooltip placement="bottom" mouseEnterDelay={1} title={'广播类型'}>
                        <a className=" itemtext " style={{ width: "73px", borderLeft: 'none' }}>
                          <span className="name" id="filename">
                            文件广播
                          </span>
                        </a>
                      </Tooltip>
                      <a className=" itemtext " style={{ width: "61px" }}>
                        <span className="name" id="typename">
                          请选择
                        </span>
                      </a>
                      <a className=" itemtext " style={{ width: "75px" }}>
                        <span className="name" id='volvalue'>
                          音量：16
                          </span>
                      </a>
                      <Tooltip placement="bottom" mouseEnterDelay={1} title={'消息级别'}>
                        <a className=" itemtext " style={{ width: "61px" }}>
                          <span className="name" id='news'>
                            一般
                          </span>
                        </a>
                      </Tooltip>
                      <Tooltip placement="bottom" mouseEnterDelay={1} title={'创建广播'}>
                        <a className="tool_item ranging item " onClick={(e) => this.formRef.submitlivedata(e)} >
                          <span className="icon">
                            <i className="anticon anticon-cloud-upload">
                            </i>
                          </span>
                          <span className="name">
                            广播
                          </span>
                        </a>
                      </Tooltip>
                      <Tooltip placement="bottom" mouseEnterDelay={1} title={'创建应急广播'}>
                        <a className="layer_item subway item " onClick={(e) => this.formRef.submitlivedataeme(e)}>
                          <span className="icon">
                            <i className="anticon anticon-cloud">
                            </i>
                          </span>
                          <span className="name">
                            应急广播
                          </span>
                        </a>
                      </Tooltip>
                      <Tooltip placement="right" mouseEnterDelay={1} title={'详情设置'}>
                        <a className="tool_item fullscreen item notfull" id="expand-button">
                          <span className="icon">
                            <i id="expand-button-icon" className="anticon anticon-arrows-alt">
                            </i>
                          </span>
                        </a>
                      </Tooltip>
                    </div>
                  </div>
                </div>
                <div id="playershow" >
                  <div id="playerbox" className="playerbox ">
                    <div className='image'></div>
                    <div className='wave'></div>
                    <div className='wave'></div>
                    <div className='wave'></div>

                    <div className='info'>
                      <h2 className='title'>监听中</h2>
                      <div id='playershowname' className='artist'>序号1</div>
                    </div>

                  </div>
                </div>
                    <div id="deviceInfo">
                       <div id="deviceInfobox" className="deviceInfobox close">
                            <div className="deviceInfoimg">
                            </div>
                            <div className="devicetitlecontain">
                            <button className="deviceTitle">
                            <div className="deviceTitleitem">
                              {this.state.devicetitle}
                            </div>
                            <div className="deviceTitleitem2">
                              {this.state.deviceinfo}
                            </div>
                            </button>
                            <button className="latlngitem" > 
                                 {this.state.devicelatlng}
                            </button>
                            </div>
                            <button className="deviceclosebtn" id="deviceclosebtn"> 
                            <i className="anticon anticon-close"></i>
                            </button>
                        </div>
                    </div>
                <div className="menu-wrap-bottom" id="mytable" >
                  <div id="bottomresize" style={{width:"100%",height :"7px",cursor: "row-resize"}}> </div>
                      <div className="menu-button-in" id="menu-button-in">
                        <div style={{ position: 'relative', padding: '4px 0px' }}>
                          {/* <i className="anticon anticon-reload bottombutton" id="open-button-reload" style={{
                            float: "left",
                            fontSize: '15px', paddingTop: '5px', paddingLeft: '11px'
                          }}></i> */}
                          <Tooltip mouseEnterDelay={0.5} title="刷新">
                          <img id="open-button-reload" className="bottombutton" src={Png} style={{height:'21px',float: "left",paddingLeft:"8px",opacity: 0.6}} />
                          </Tooltip>
                      <div id="open-button-div">
                            <i className="updown-text">广播列表</i>
                            <i className="anticon anticon-up bottombutton" id="open-button-bottom" style={{
                              float: "left",
                              fontSize: "15px", paddingTop: '5px'
                            }}></i>
                          </div>
                        </div>

                      </div>



                  <div style={{ margin: "15px 15px 0 15px" }}>
                    <Spin size="large" spinning={this.state.loading} delay={100} >
                      <DetailTable
                        setSet={this.setSet.bind(this)}
                        sourcedata={this.state.listsourcedata}
                        store={this.store}
                        scoll={this.state.bottomheight-39}
                        reloadtable={this.reloadtable.bind(this)}
                        Auth={[this.state.userAuthdelete,this.state.userAuthmodify]}
                      />
                    </ Spin>
                  </div>
                  <iframe id="iframe-audio" name="audiochild" src={this.state.livesrc} width="15" height="15" frameborder="no" border="0" style={{ position: 'absolute',borderStyle: "hidden",bottom: 0,
    right: "16px" }}></iframe>
                </div>
                {/* <button className="menu-button-bottom" id="open-button-bottom"><a style={{"color":"#45494e"}} className="anticon anticon-down" /></button> */}
                {/* <div className="menu-button-updown">
                  <div style={{ position: 'relative', padding: '4px 0px' }}>
                    <i className="anticon anticon-reload bottombutton" id="open-button-reload" style={{
                      float: "left",
                      fontSize: '15px', paddingTop: '5px', paddingLeft: '11px'
                    }}></i>
                    <div id="open-button-div">
                      <i className="updown-text">广播列表</i>
                      <i className="anticon anticon-up bottombutton" id="open-button-bottom" style={{
                        float: "left",
                        fontSize: "15px", paddingTop: '5px'
                      }}></i>
                    </div>
                  </div>

                </div> */}
              </div>

              {/* </Content> */}
            </Layout>
          </Layout>
{/* 
          <div id="Zymodal" className="Zymodal">
            <div className="ao-preview ao-cont">
              <div className="ao-annotations">
                <span>地图框选设备工具</span>
                <span>可管理区域</span>
                <span>创建广播工具条</span>
                <span>区域选择侧边栏</span>
                <span>在线广播列表</span>
              </div>
            </div>
          </div>   */}


        </div>
        <style>{`
          body{
            overflow-y: scroll;
            overflow-x: hidden;
            min-width:650px;
            -webkit-touch-callout: none;

-webkit-user-select: none; 

-khtml-user-select: none; 

-moz-user-select: none; 

-ms-user-select: none; 

user-select: none; 
          }
          .gutter-box {
            {/* padding:3px 0; */}
          }
          .ant-card-extra {
          position: absolute;
              right: 24px;
              top: 0;
          }
          #formstyle .ant-form-item {
              margin-bottom: 6px;
          }
          #mytable .ant-table-tbody>tr>td,#mytable .ant-table-thead>tr>th {
              padding: 3px 8px;
              word-break: break-all;

          }
          #mytable .ant-table table{
            border-radius:0; 
          }
          #mytable .ant-table{
            border-radius:0; 
          }
          #mytable td {
            background-color:#fff;
          }
          #mytable .lineclamp{
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
          }
          #gutter-box .myshadow{
            box-shadow: 2px -2px 4px rgba(0,0,0,0.2),0 -1px 0px rgba(0,0,0,0.02)
          }
          .mysider{
            box-shadow:  0 0 20px rgba(0, 0, 0, 0.3);
            z-index: 500;
          }
          #mysider  .ant-layout-sider-zero-width-trigger{
            background: #fff;
            color: #000;
            top: 15px;
            right:-18px;
            height: 45px;
            width:19px;
            box-shadow: 2px 2px 2px rgba(0,0,0,.15);
          }
          #mysider  .ant-layout-sider-zero-width-trigger i:hover{
            opacity: .6;
          }
          #gutter-box .leaflet-top ,.leaflet-right{
            z-index:500
          }
          #resizediv1::-webkit-scrollbar-track
          {
            -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
            background-color: #fff;
          }

          #resizediv1::-webkit-scrollbar
          {
            width: 6px;
            background-color: #fff;
          }

          #resizediv1::-webkit-scrollbar-thumb
          {
            background-color:rgba(70, 68, 68, 0.17);
          }
          button#newscontent {
            height:28px
          }
          #formstyle .ant-input-disabled{
            background-color:#fff;
            cursor: default;
          }
        `}
        </style>
        <style>{`
          .playershowon #playerbox{
            display:block
          }
          #playerbox {
            background: #fff;
            box-shadow: 9px 7px 37px -6px rgba(0, 0, 0, 0.75);
            overflow: hidden;
            position: absolute;
            width: 124px;
            height: 188px;
            display:none
}
.playerbox {
    top: 12px;
    right: 90px;
    z-index:400;
}
#deviceInfobox{
            background: #fff;
            box-shadow: 0px 0px 20px -5px rgba(0, 0, 0, 0.75);
            overflow: hidden;
            position: absolute;
            width: 384px;
            height: 72px;
            display:flex
}
.deviceInfobox{
          bottom: 34px;
          left: 40%;
          z-index:400;
}
#deviceInfo  .close{
  display:none;
}
.show-menu-bottom .deviceInfobox{
          bottom: 189px;
        }
.deviceInfoimg{
  height: 64px;
    width: 96px;
    margin: 4px;
    position: relative;
    background-size: 96px 64px;
    background-image: url(${require("./yzt.jpg")});
}
.devicetitlecontain{
  font-size: 12px;
    line-height: 12px;
    padding: 12px;
}
.deviceTitle{
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: 0;
  outline: 0;
  font: inherit;
  vertical-align: baseline;
  background: transparent;
  list-style: none;
  overflow: visible;
  cursor: pointer;
    text-align: left;
    width: 251px;
    display: block;
}
.deviceTitleitem{
  padding-bottom: 6px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: bold;

}
.latlngitem{
  margin: 0;
    padding: 0;
    border: 0;
    border-radius: 0;
    outline: 0;
    font: inherit;
    vertical-align: baseline;
    background: transparent;
    list-style: none;
    overflow: visible;
    color: #999;
    text-align: left;
    width: 251px;
}
.deviceTitleitem2{
  padding-bottom: 6px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.deviceclosebtn{
  margin: 0;
    padding: 0;
    border: 0;
    border-radius: 0;
    outline: 0;
    font: inherit;
    vertical-align: baseline;
    background: transparent;
    list-style: none;
    overflow: visible;
  top: 2px;
    right: 2px;
    position: absolute;
    color: #000;
    cursor: pointer;
}
.deviceclosebtn:hover{
  opacity:0.7;
}
@keyframes wave {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

#playerbox .image {
  background: url(${require("./timg.jpg")}) no-repeat 75%;
  background-size: cover;
  position: absolute;
    position: absolute;
    z-index: 1;
    opacity: 0.3;
    height: 100px;
    width: 128px;
}
#playerbox .image::after {
    height: 54px;
    content: '';
    top: 46px;
    position: absolute;
    width: 100%;
    z-index: 1;
    background: linear-gradient(rgba(221, 65, 127, 0), #444);
}
#playerbox  .wave {
    position: absolute;
    height: 269px;
    width: 269px;
    opacity: 0.6;
    left: 0;
    top: 0;
    margin-left: -70%;
    margin-top: -130%;
    border-radius: 40%;
    background: radial-gradient(#353535, #383737);
    animation: wave 3000ms infinite linear;
}
#playerbox  .wave:nth-child(2) {
    top: 10px;
    animation: wave 4000ms infinite linear;
}
#playerbox  .wave:nth-child(3) {
    top: 10px;
    animation: wave 5000ms infinite linear;
}
#playerbox  .info {
    position: absolute;
    bottom: 13px;
    left: 0;
    right: 0;
    text-align: center;
}
#playerbox  .title {
    font-size: 1.6em;
    font-weight: 400;
    color: #333;
    margin-bottom: 8px;
    text-transform: uppercase;
    font-family: 'Reem Kufi', sans-serif;
}
#playerbox  .artist {
    color: #cfcfcf;
    font-size: 1em;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    font-family: 'Reem Kufi', sans-serif;
}            
            
            
            `}
        </style>

        <style>{`
        #layerbox {
    background: #fff;
    z-index: 500;
    -webkit-border-radius: 1px;
    -moz-border-radius: 1px;
    -o-border-radius: 1px;
    border-radius: 3px;
}
.layerbox {
    top: 15px;
    left: 54px;
    z-index: 1999;
    background: #fff;
    border-radius: 1px;
    box-shadow: 2px -2px 4px rgba(0,0,0,0.2),0 -1px 0px rgba(0,0,0,0.02);
    {/* box-shadow: 2px 2px 2px rgba(0,0,0,.15); */}
}
.layerbox, .tooldragbar {
    position: absolute;
}
.tooldragup {
    top: -5px;
}
.tooldragdown {
    bottom: -5px;
}
.tooldragdown, .tooldragup {
    height: 10px;
    width: 100%;
    left: 0;
}
.tooldragleft {
    left: -6px;
}
.tooldragright {
    right: -6px;
}
.tooldragleft, .tooldragright {
    height: 100%;
    width: 12px;
    top: 0;
}
#layerbox_item {
    padding: 14px 2px 31px;
    background: #fff;
    border-radius: 3px;
}
#layerbox_item .show-list {
    position: relative;
}
#layerbox_item .item {
    float: left;
    height: 18px;
    padding: 0 12px;
    font-size: 12px;
    border-left: 1px #dbdee2 dashed;
    vertical-align: middle;
    cursor: pointer;
    overflow: visible;
    zoom: 1;
    color: #5f6477;
}
#layerbox_item .item:hover{
  opacity: .6;
}
.bottombutton:hover{
  opacity: .6;
}
#layerbox_item .itemtext {
    float: left;
    height: 18px;
    padding: 0 12px;
    font-size: 12px;
    border-left: 1px #dbdee2 dashed;
    vertical-align: middle;
    cursor: default;
    overflow: visible;
    zoom: 1;
    color: #5f6477;
}
#layerbox_item .item .name {
    line-height: 18px;
}
#layerbox_item .item span {
    display: inline-block;
    vertical-align: middle;
    float: left;
}
          
          `}
        </style>

        <style>{`
  .updown-text{
    float: left;
                  width: 89px;
                  float: left;
                  font-size: 12px;
                  cursor: default;
                  padding: 3px 0px;
                  text-align: center;
                  font-style: normal;
  }
  #open-button-div:hover{
    opacity: 0.6;
  }
  #open-button-div{
    cursor:pointer;
  }
        button:focus {
          outline: none;
        }
        .menu-button {
          position: absolute;
          top: 0;
          z-index: 500;
          {/* margin: 1em; */}
          padding: 0;
          width: 2.5em;
          height: 2.25em;
          border: none;
          font-size: 3em;
          color: #373a47;
          background: transparent;
        }
        
        .menu-button span {
          display: none;
        }
        
        .menu-button:hover {
          opacity: 0.6;
        }
        
        .menu-button-updown{
          position: absolute;
          bottom: 20px;
          right:1em;
          z-index: 500;
          border-radius: 2px 2px 0 0;
          box-shadow: -1px -1px 2px 0px rgba(0,0,0,0.1),1px -1px 2px 0px rgba(0,0,0,0.1);
          cursor: pointer;
          height: 30px;
          background-color: white;
          border-radius: 2px;
          padding: 0;
          border: none;
          box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.3);
          width: 144px;
          {/* transition: bottom 1.957s;
          -webkit-transition: bottom 1.957s;
          transition-delay: 0.12s;
          -moz-transition-delay: 0.12s;; /* Firefox 4 */
          -webkit-transition-delay:0.12s;; /* Safari 和 Chrome */
          -o-transition-delay: 0.12s;; */}
          transition: bottom 1.4369s;
          -webkit-transition: bottom 1.4369s;
          transition-delay: 0.068s;
          -moz-transition-delay: 0.068s;; /* Firefox 4 */
          -webkit-transition-delay:0.068s;; /* Safari 和 Chrome */
          -o-transition-delay: 0.068s;;
        }
        .menu-button-in{
          border-radius: 2px 2px 0 0;
          box-shadow: -1px -1px 2px 0px rgba(0,0,0,0.1),1px -1px 2px 0px rgba(0,0,0,0.1);
          cursor: pointer;
          height: 30px;
          background-color: white;
          padding: 0;
          border: none;
          width: 144px;
          margin-top: -36px;
          margin-left:${this.state.collapsed ? window.innerWidth-180 : window.innerWidth-180 - 275}px;
        }

        /* Menu */
        .menu-wrap {
          position: absolute;
          z-index: 499;
          background-color: #fff;
          width: 0;
          height: 0;
          font-size: 1.5em;
          top: 58px;
          left: 54px;
          dispaly:none;
          box-shadow: 2px 2px 4px rgba(0,0,0,0.2),0 -1px 0px rgba(0,0,0,0.02)
        }
        .menu-wrap-bottom {
          position: absolute;
          z-index: 699;
          background-color: #fff;
          width: 0;
          height:0;
          background: #f8f8f8;
          font-size: 1.5em;
          bottom: 0;
          border: 1px #bababa solid;
          box-shadow: 0px -3px 6px rgba(0,0,0,0.15);
        }

        
        .menu {
          height: 100%;
          font-size: 0.65em;
          color: #64697d;
          text-align: right;
        }
        
        
        .link-list {
          padding: 1.35em 0;
          margin: 0 0.75em;
          display:none;
        }
        {/* .show-menu .menu {
          opacity: 1;
          -webkit-transition: opacity 1s 0.5s;
          transition: opacity 1s 0.5s;
        } */}
        .show-menu .link-list {
          display:block;
        }

        /* Shown menu */
        
        .show-menu .menu-wrap {
          width: 457px;
          height: 134px;
          {/* animation:mymove 0.5s ;
          -webkit-animation:mymove 0.5s ; /*Safari and Chrome*/ */}
        }

        @keyframes mymove
        {
        from {height:0px;}
        to {height:134px;}
        }

        @-webkit-keyframes mymove /*Safari and Chrome*/
        {
        from {height:0px;}
        to {height:134px;}
        }

        .show-menu-bottom .menu-wrap-bottom {
            height:${this.state.bottomheight}px;
            width:${this.state.collapsed ? window.innerWidth : window.innerWidth - 275}px;
          {/* animation:bottommove 2.08285s ;
          -webkit-animation:bottommove 2.08285s ; /*Safari and Chrome*/  */}
          animation:bottommove 0.5s ;
          -webkit-animation:bottommove 0.5s ; /*Safari and Chrome*/ 
        }
        @keyframes bottommove
        {
        from {height:0px;}
        to {height:${this.state.bottomheight}px;}
        }

        @-webkit-keyframes bottommove /*Safari and Chrome*/
        {
        from {height:0px;}
        to {height:${this.state.bottomheight}px;}
        }

        .show-menu-bottom .menu-button-updown{
          bottom: ${this.state.bottomheight}px;
        }
        `}
        </style>
        <style>{`
        .Zymodal{  
    display: block;  
    width: 100%;  
    height: 100%;  
    position: fixed;  
    left: 0;  
    top: 0;  
    z-index: 1000;  
    background-color: rgba(0,0,0,0.5);  
}  







.ao-preview {
	width: 100%;
	height: 100%;
	/*float: left;*/
	position: relative;
}


.ao-annotations {
	width: 100%;
	height: 100%;
	position: absolute;
	top: 0px;
	left: 0px;
	background: rgba(33,62,68,0.3);
	box-shadow: 1px 1px 3px rgba(0,0,0,0.05);
	-ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";
    filter: alpha(opacity=0);
	opacity: 0;
	z-index: 5;
	-webkit-transform: scale(0.8);
	-moz-transform: scale(0.8);
	-o-transform: scale(0.8);
	-ms-transform: scale(0.8);
	transform: scale(0.8);
	-webkit-transition: all 0.3s ease-in-out;
	-moz-transition: all 0.3s ease-in-out;
	-o-transition: all 0.3s ease-in-out;
	-ms-transition: all 0.3s ease-in-out;
	transition: all 0.3s ease-in-out;
}

.ao-annotations span {
	display: block;
	position: absolute;
	padding: 10px 25px;
	width: 200px;
	min-width: 140px;
	text-align: center;
	background: rgba(255,255,255,1);
	color: rgba(20,40,47,0.9);
	font-size: 16px;
	font-style: italic;
	text-shadow: 1px 1px 1px rgba(255,255,255,0.9);
	box-shadow: 0px 1px 4px rgba(0,0,0,0.2);
	-ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";
    filter: alpha(opacity=0);
	opacity: 0;
	-webkit-transform: scale(1.3);
	-moz-transform: scale(1.3);
	-o-transform: scale(1.3);
	-ms-transform: scale(1.3);
	transform: scale(1.3);
	-webkit-transition: all 0.3s ease-in-out;
	-moz-transition: all 0.3s ease-in-out;
	-o-transition: all 0.3s ease-in-out;
	-ms-transition: all 0.3s ease-in-out;
	transition: all 0.3s ease-in-out;
}

.ao-annotations span:after {
	position: absolute;
	background: transparent url(${require("./arrow.png")}) no-repeat center center;
	width: 32px;
	height: 33px;
	top: 50%;
	left: 100%;
	margin: -16px 0 0 -16px;
	content: '';
}

.ao-annotations span:nth-child(1) {
  top: 159px;
  right: 162px;
}

.ao-annotations span:nth-child(2) {
	top: 50%;
	left: 50%;
}

.ao-annotations span:nth-child(3) {
	top: 78px;
  left: 550px;
}

.ao-annotations span:nth-child(4) {
  top: 50%;
  left: 32px;
}

.ao-annotations span:nth-child(5) {
  bottom: 13px;
  right: 200px;
}


.ao-annotations span:nth-child(3):after,
.ao-annotations span:nth-child(4):after,
.ao-item:nth-child(2) .ao-annotations span:nth-child(1):after {
	left: auto;
	right: 100%;
	margin: -16px -16px 0 0;
	background-image: url(${require("./arrow_left.png")});
}


.ao-cont .ao-annotations,
.ao-cont  .ao-annotations span{
	-ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=99)";
    filter: alpha(opacity=99);
	opacity: 1;
	-webkit-transform: scale(1);
	-moz-transform: scale(1);
	-o-transform: scale(1);
	-ms-transform: scale(1);
	transform: scale(1);
}

.ao-cont  .ao-annotations span:nth-child(1) {
	-webkit-transition-delay: 0.3s;
	-moz-transition-delay: 0.3s;
	-o-transition-delay: 0.3s;
	-ms-transition-delay: 0.3s;
	transition-delay: 0.3s;
}
.ao-cont  .ao-annotations span:nth-child(2) {
	-webkit-transition-delay: 0.4s;
	-moz-transition-delay: 0.4s;
	-o-transition-delay: 0.4s;
	-ms-transition-delay: 0.4s;
	transition-delay: 0.4s;
}
.ao-cont   .ao-annotations span:nth-child(3) {
	-webkit-transition-delay: 0.5s;
	-moz-transition-delay: 0.5s;
	-o-transition-delay: 0.5s;
	-ms-transition-delay: 0.5s;
	transition-delay: 0.5s;
}
.ao-cont   .ao-annotations span:nth-child(4) {
	-webkit-transition-delay: 0.6s;
	-moz-transition-delay: 0.6s;
	-o-transition-delay: 0.6s;
	-ms-transition-delay: 0.6s;
	transition-delay: 0.6s;
}

.ao-cont   .ao-annotations span:nth-child(5) {
	-webkit-transition-delay: 0.7s;
	-moz-transition-delay: 0.7s;
	-o-transition-delay: 0.7s;
	-ms-transition-delay: 0.7s;
	transition-delay: 0.7s;
}



          
          `}</style>
      </section>
    )
  }

}
)

export default LiveBroad;