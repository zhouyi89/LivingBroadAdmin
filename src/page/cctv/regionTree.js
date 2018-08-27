import React from 'react';
import { Tree, message,Icon,Modal,Form, Input,Select } from 'antd';
import { ContextMenu, Item, Separator, Submenu, ContextMenuProvider, theme, animation  } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.min.css';
import {netdata} from './../../helper';
const FormItem = Form.Item;
const TreeNode = Tree.TreeNode;
const Option = Select.Option;
let treeDataDic= [];
let devices=[];
let yzdevices=[];
// const x = 3;
// const y = 2;
// const z = 1;
// const gData = [];
let deviceD={}
let dDD=[]
let rightnodeinfo;
let yzDataDic= [];
class regionTree extends React.Component {
  state = {
    autoExpandParent: true,
    gData: [],
    Slectkey:"-1",
    rightnodeinfo:[],
    addvisible:false,
    adddevicevisible:false,
    addregionname:"",
    titlename:"",
    devicetitlename:"",
    devicename:"",
    deviceip:"",
    deviceDATA:[],
    selectedKeys:-1,
    devicesList:[],
    yzChecked:[]
  };
  MyAwesomeMenu = () => (
    <ContextMenu id='menu_id'>
       <Item >Lorem</Item>
       <Item >Ipsum</Item>
       <Separator />
       <Item disabled>Dolor</Item>
       <Separator />
       <Submenu label="Foobar">
        <Item >Foo</Item>
        <Item >Bar</Item>
       </Submenu>
    </ContextMenu>
  );
  renderTreeNodes = data => {
    if (data.length === 0) return <TreeNode title="无数据" />;
    return data.map(item => {
      deviceD[item.id]=item.children
      let haveregionchild = false;
      item.children.map(item => {
        if (item.DevType === 0) {
          haveregionchild = true;
        }
      });
      let idname="all"
      if(item.id=="-1"){
        idname="add"
      }
      else{

      }
      const title = (
        <ContextMenuProvider id={idname}>
        <span>
          <Icon type="video-camera" style={{ marginRight: "5px" }} />
          {/* <Icon type="video-camera" /> */}
          <span>{item.desc}</span>
        </span>
        </ContextMenuProvider>
      );
      if (haveregionchild) {
        if (item.children.length !== 0) {
          return (
            <TreeNode title={title} key={item.id} value={item.desc}>
              {this.renderTreeNodes(item.children)}
            </TreeNode>
          );
        }
        
        return <TreeNode title={title} key={item.id} value={item.desc} />;
      } else {
        if(item.DevType!=1){
          return <TreeNode title={title} key={item.id} value={item.desc} />;
        }
        
      }
    });
  };
  componentDidMount() {
    this.props.store.subscribe(() => {
      const { data,changeTag } = this.props.store.getState();          
     if(changeTag)
      {this.setState({gData:data})
      dDD=[];
      this.initdeviceData(deviceD[this.state.selectedKeys]);
      this.props.store.setState({ deviceDATA:dDD ,changeTag:false});
    }
      
   });
      this.reload();
  }

  initdeviceData(data){
       for(let i=0;i<data.length;i++){

        if(data[i].DevType=="1"){
          dDD.push(data[i])
        }
            if(data[i].children.length!=0){
              this.initdeviceData(data[i].children);
            }

       }
  }

reload(){
  let that=this;
      let r = {
      method: "POST",
      body: JSON.stringify({ opt: "getTree" })
    };
    netdata("/topoly/videoTreeOpt.epy", r).then(that.ondata.bind(this));

    let r1 = {
    method: "POST",
    body: JSON.stringify({ opt: "getTree" })
  };
  netdata("/topoly/regionTreeOpt.epy", r1).then(that.yzondata.bind(this));
}
yzondata(res){
  if (res.d.errCode == 0) {
    this.getTreeDic(res.d.Values);
    let devicesList=  this.inityzdata(yzDataDic[-1]);
    const { store } = this.props;
    this.setState({devicesList:devicesList})
    store.setState({devicesList:devicesList});
  } else {
  }
}

getTreeDic = data => {
  return data.map(item => {
    yzdevices = [];
    this.getyzDevice(item);
    yzDataDic[item.id] = yzdevices;
    if (item.children.length != 0) {
      this.getTreeDic(item.children);
    }
  });
};
getyzDevice(data) {
  data.children.map(item => {
    if (item.eocT !== -1 && item.eocT !== 0) {
      yzdevices.push(item);
    } else {
      this.getyzDevice(item);
    }
  });
}
inityzdata(ddata){
  let devicesList={}
  let no1=[],no2=[],no3=[],no4=[],no5=[];
  ddata.map(item=>{
    
    switch (item.DevType) {
      case '1':
      no1.push(item);
        break;
      // case "2":
      // no2.push(item);
      //   break;
      // case "3":
      // no3.push(item);
      //     break;
      // case "4":
      // no4.push(item);
      //     break;
      // case "5":
      // no5.push(item);
          break;
      default:
        break;
    }
  })
  devicesList['dev1']=no1;
  // devicesList['dev2']=no2;devicesList['dev3']=no3;devicesList['dev4']=no4;devicesList['dev5']=no5;
  return devicesList;
}
  ondata(res) {
    if (res.d.errCode == 0) {   
      this.setState({ gData: res.d.Values });
      dDD=[]
       this.initdeviceData(deviceD[-1]);
       this.setState({deviceDATA:dDD})
       this.props.store.setState({ deviceDATA:dDD })

    } else {
      message.error(res.d.errCode);

    }
  }
  onRightClick = (info)=>{
    rightnodeinfo=info.node.props
  }
  deleteitemClick(){
    let that=this; 
      let r = {
      method: "POST",
      body: JSON.stringify({ opt: "delRegion",id: parseInt(rightnodeinfo.eventKey)})
    };
    netdata("/topoly/videoTreeOpt.epy", r).then(that.deleteondata.bind(that));
    
  }
  deleteondata(res) {
    if (res.d.errCode == 0) {
      this.setState({ gData: res.d.Values });
      message.success("删除成功！");
    } else {
      message.error(res.d.errCode);
    }
  }

  additemClick(){   
     this.setState({
        addvisible: true,titlename:"添加区域"
      });
  }
  adddeviceitemClick(){
    this.setState({
      adddevicevisible: true,devicetitlename:"添加摄像头",yzChecked:[]
    });
  }
  modifyitemClick(){   
    this.setState({
       addvisible: true,titlename:"修改区域",addregionname:rightnodeinfo.value
     });
 }
  addregionondata(res) {
    if (res.d.errCode == 0) {
      this.setState({ gData: res.d.Values });
      message.success("添加成功！");
      this.setState({
        addvisible: false,addregionname:""
      });

    } else {
      message.error(res.d.errCode);
    }
  }
  modifyregionondata(res) {
    if (res.d.errCode == 0) {
      this.setState({ gData: res.d.Values });
      message.success("修改成功！");
      this.setState({
        addvisible: false,addregionname:""
      });

    } else {
      message.error(res.d.errCode);
    }
  }
  adddeviceondata(res) {
    if (res.d.errCode == 0) {
      this.setState({ gData: res.d.Values });
      message.success("添加成功！");
      dDD=[];
       this.initdeviceData(deviceD[this.state.selectedKeys]);
       this.props.store.setState({ deviceDATA:dDD });
      this.setState({
        adddevicevisible: false,devicename:"",deviceip:""
      });

    } else {
      message.error(res.d.errCode);
    }
  }
  modifydeviceondata(res) {
    if (res.d.errCode == 0) {
      this.setState({ gData: res.d.Values });
      message.success("修改成功！");
      this.setState({
        adddevicevisible: false,devicename:"",deviceip:""
      });

    } else {
      message.error(res.d.errCode);
    }
  }
  onSelect = (selectedKeys, info) => {
    dDD=[]
    if(selectedKeys.length===0){
      return;
    }
     this.initdeviceData(deviceD[parseInt(selectedKeys[0])]);
     this.setState({deviceDATA:dDD,selectedKeys:parseInt(selectedKeys[0])})
     this.props.store.setState({ deviceDATA:dDD })

    
  };
adddevicehandleOk(){
  let that=this; 
  let name =this.state.devicename;
  let ip =this.state.deviceip;
  if(name===""){
    message.error("请输入摄像头名称！");
    return;
  }
  if(this.state.devicetitlename=="添加摄像头")
      {  let bindyz =`${this.state.yzChecked}`
          let r = {
          method: "POST",
          body: JSON.stringify({ opt: "addDevice",parentid: parseInt(rightnodeinfo.eventKey),desc:name,ipaddr:ip,bindspeakerids:bindyz,jsoninfo:""})
        };
        netdata("/topoly/videoTreeOpt.epy", r).then(that.adddeviceondata.bind(that));
      }else{
        
        // let r = {
        //   method: "POST",
        //   body: JSON.stringify({ opt: "mfyDevice",parentid: parseInt(rightnodeinfo.eventKey),desc:name,ipaddr:ip,bindspeakerids:" ",jsoninfo:""})
        // };
        // netdata("/topoly/videoTreeOpt.epy", r).then(that.modifydeviceondata.bind(that));
      }
}

adddevicehandleCancel(){
  this.setState({
    adddevicevisible: false
  });
}
  addhandleOk(){
    let that=this; 
    let name =this.state.addregionname;
    if(name===""){
      message.error("请输入区域名称！");
      return;
    }
    if(this.state.titlename=="添加区域")
        {  
            let r = {
            method: "POST",
            body: JSON.stringify({ opt: "addRegion",parentid: parseInt(rightnodeinfo.eventKey),desc:name})
          };
          netdata("/topoly/videoTreeOpt.epy", r).then(that.addregionondata.bind(that));
        }else{
          let r = {
            method: "POST",
            body: JSON.stringify({ opt: "mfyRegion",id: parseInt(rightnodeinfo.eventKey),desc:name})
          };
          netdata("/topoly/videoTreeOpt.epy", r).then(that.modifyregionondata.bind(that));
        }

  }
  addhandleCancel(){

    this.setState({
      addvisible: false,addregionname:""
    });
  }

  addregionnameChange(e){
    this.setState({ addregionname: e.target.value });
  }
  nameChange(e){
    this.setState({ devicename: e.target.value });
  }
  ipChange(e){
    this.setState({ deviceip: e.target.value });
  }
  renderOption(data){
    if(data.length===0){
      return [];
    }
    let dd =data["dev1"];
    let children = [];
    for (let index = 0; index < dd.length; index++) {
    
      children.push(<Option value={dd[index].id} key={dd[index].id}>{dd[index].desc+"——"+dd[index].RegionName}</Option>);
    }
    return children;
  }

  tzhandleChange(value) {
    this.setState({yzChecked:value})
  }

  render() {
    const {  autoExpandParent } = this.state;
    let layout={
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    }
    return (
      <div style={{ margin: "12px" }}>
        {/* <Search style={{ marginBottom: 8 }} placeholder="搜索区域" /> */}
        <Tree
          onSelect={this.onSelect.bind(this)}
          defaultExpandAll={true}
          autoExpandParent={autoExpandParent}
          defaultSelectedKeys={["-1"]}
          onRightClick={this.onRightClick.bind(this)}
        >
          {this.renderTreeNodes(this.state.gData)}
        </Tree>

        <ContextMenu id='all' theme={theme.dark} animation={animation.pop}>
       <Item onClick={this.deleteitemClick.bind(this)}>  <Icon type="close-square-o" style={{margin: "3px 7px 0 0"}} />删除区域</Item>
       <Separator />
       <Item onClick={this.additemClick.bind(this)}> <Icon type="plus-square-o" style={{margin: "3px 7px 0 0"}} />添加区域</Item>
       <Item onClick={this.adddeviceitemClick.bind(this)}> <Icon type="plus-square-o" style={{margin: "3px 7px 0 0"}} />添加摄像头</Item>
       <Item  onClick={this.modifyitemClick.bind(this)} label="Foobar"> <Icon type="edit" style={{margin: "3px 7px 0 0"}} />修改区域</Item>
        </ContextMenu>


        <ContextMenu id='add' theme={theme.dark} animation={animation.flip}>
       {/* <Item onClick={this.itemClick}>  <Icon type="close-square-o" style={{margin: "3px 7px 0 0"}} />删除</Item>
       <Separator /> */}
       <Item onClick={this.additemClick.bind(this)}> <Icon type="plus-square-o" style={{margin: "3px 7px 0 0"}} />添加区域</Item>
       {/* <Item  label="Foobar"> <Icon type="edit" style={{margin: "3px 7px 0 0"}} />修改</Item> */}
        </ContextMenu>


        <Modal title={this.state.titlename}
          visible={this.state.addvisible}
          onOk={this.addhandleOk.bind(this)}
          onCancel={this.addhandleCancel.bind(this)}
        >
        <FormItem
        {...layout}
        label="区域名称">

            <Input value={this.state.addregionname}  placeholder="输入名称" onChange={this.addregionnameChange.bind(this)}/>

        </FormItem>
        </Modal>

        <Modal title={this.state.devicetitlename}
          visible={this.state.adddevicevisible}
          onOk={this.adddevicehandleOk.bind(this)}
          onCancel={this.adddevicehandleCancel.bind(this)}
        >
        <FormItem
       {...layout}
        label="摄像头名称">

            <Input value={this.state.devicename}  placeholder="输入名称" onChange={this.nameChange.bind(this)}/>

        </FormItem>
        <FormItem
       {...layout}
        label="地址">

            <Input value={this.state.deviceip}  placeholder="输入摄像头地址" onChange={this.ipChange.bind(this)}/>

        </FormItem>
        <FormItem
       {...layout}
        label="绑定音柱">

              <Select
                mode="tags"
                style={{ width: '100%' }}
                onChange={this.tzhandleChange.bind(this)}
                tokenSeparators={[',']}
                value={this.state.yzChecked}
              >
                {this.renderOption(this.state.devicesList)}
              </Select>

        </FormItem>
        </Modal>
      </div>
    );
  }
}

export default regionTree;