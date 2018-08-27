import React from 'react';
import { Layout,Row,Col, Menu, Breadcrumb, Icon, Affix, Button,Input,TreeSelect,Popover,Popconfirm,message ,Select,Tree} from 'antd';
import createStore from '../createStore';
import { withRouter } from 'react-router'
import { netdata } from './../../helper'
import UScontent from './UScontent'
const SubMenu = Menu.SubMenu;
const Option = Select.Option;
const MenuItemGroup = Menu.ItemGroup;
const TreeNode = TreeSelect.TreeNode;
const TreeNode1 = Tree.TreeNode;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
const { Header, Content, Sider } = Layout;
let Glteamdata = [];
let rolePostdata =[];
let gData = [];
let LevData=[];
let regionIdLst=[];
let regionlogicLst=[];
let LevLst=[];
let logicaddrtoId=[]
class AuthConfig extends React.Component {
  constructor(props) {
    super(props);
    // 初始化 store
    this.store = createStore({
      teamdata: [],

    });
  }

  state = {
    menudata: [],
    currentMenukey: '-1',
    teamedit:false
  };

  componentDidMount() {
    let r = {
      method: "POST",
      body: JSON.stringify({"opt":"getTree"})
    }
    netdata('/topoly/regionTreeOpt.epy', r).then(this.ongdata.bind(this));
    let r1 = {
      method: "POST",
      body: JSON.stringify()
    }
    netdata('/AuthFunsCfg.epy', r1).then(this.onlevdata.bind(this))
  }

  ongdata(res) {
    if(res.d.errCode === "Cookie过期"){
      this.props.history.replace('/power')
    }
    if (res.s === false) {
      return;
    }
    if(res.d.errCode == 0){
      gData = res.d.Values;
    }
  }

  onlevdata(res) {
    if (res.s === false) {
      return;
    }
    if(res.d.errCode == 0){
      LevData = res.d.Values;
    }
  }

  componentWillMount() {
      this.reloadteam();
  }

  ondata(res) {
    if(res.d.errCode === "Cookie过期"){
      this.props.history.replace('/power')
    }
    if (res.d.errCode == 0) {
      if(res.d.Values.length==0){
        this.setState({ menudata: res.d.Values,currentMenukey: "-1"});
      }
      else{
          this.setState({
              menudata: res.d.Values,
              currentMenukey:res.d.Values.filter(item=>item.id==this.state.currentMenukey).length>0?this.state.currentMenukey:res.d.Values[0].id.toString()
          });
          try {
            this.refs.changeloading.switchData(this.state.currentMenukey);
          } catch (error) {
            
          }
  
      }
    }
  }

  reloadteam() {
    let r = {
      method: "POST",
      body: JSON.stringify({ "opt": "getRole" })
    }
    netdata('/RoleOpt.epy', r).then(this.ondata.bind(this))
  }

  renderContent(key) {
    try {
        let teamdata = this.store.getState().teamdata;
        if (key == "0") {
            return <UScontent ref="changeloading" pid={key} datasource={[]} store={this.store}
                              onreload={this.reloadteam.bind(this)}/>
        }
        else if (teamdata.length != 0 && teamdata[key]!=null) {
            let children = teamdata[key].children;
            if (children.length == 0) {
                return <UScontent ref="changeloading" pid={key} datasource={[]} store={this.store}
                                  onreload={this.reloadteam.bind(this)}/>
            }
            else {
                for (let i = 0; i < children.length; i++) {
                    children[i]["editable"] = false;
                    children[i]["isNew"] = false;
                    children[i]["key"] = children[i].id;
                }
                return <UScontent ref="changeloading" pid={key} datasource={children} store={this.store}
                                  onreload={this.reloadteam.bind(this)}/>;
            }
        }
    }
    catch(ex) {}
  }

  menuRender = (data) => {
    let teamdata = [];
    if (data.length === 0)
      return '';
    var myc = data.map((item) => {
      teamdata[item.id] = item;
      Glteamdata[item.id]=item;
      let regionId=[];
      let levId=[];
      let lst =item.RegionId.split(",");
      for(let i= 0;i<lst.length;i++){
          regionId.push(parseInt(lst[i]));
      }
      let lst1 =item.LevelId.split(",");
      for(let i= 0;i<lst1.length;i++){
        levId.push(parseInt(lst1[i]));
      }
      regionIdLst[item.id]=regionId;
      LevLst[item.id]=levId;
       regionlogicLst[item.id]=item.logicaddr;
      return <Menu.Item key={item.id} style={{ fontSize: "14px" }}><Icon type="team" />{item.name + "(" + item.nameExt + ")"}</Menu.Item>
    });
    this.store.setState({ teamdata: teamdata });
    rolePostdata =Glteamdata;
    return myc;
  }

  handleClick(item) {
    this.setState({
        currentMenukey: item["key"],
        teamedit:false,
    })
      this.refs.changeloading.switchData(item["key"]);
  }

  getBLen(str) {
    if (str == null) return 0;
    if (typeof str != "string"){
      str += "";
    }
    return str.replace(/[^\x00-\xff]/g,"01").length;
  }

  infoRender(key,type){
    let tt =this.store.getState("teamdata");
    if(typeof(tt.teamdata[key])=="undefined")
      return "";
    if(tt.teamdata.length==0)
      {return "";}
    else{
      switch(type){
        case "name":
        return  Glteamdata[key].name     
        break;
        case "desc":
        return   Glteamdata[key].nameExt  
        break;
        case "area":
              let text =Glteamdata[key].RegionName
              let len=this.getBLen(text);
              let txt;
              let pop;
              if(len>10&&len<300){
                  txt=text.substring(0,10)+"...";
                  pop =(<div className="mypopdiv">{text}</div>);
              }
              else if (len>300 ){
                  txt=text.substring(0,10)+"...";
                  pop =(<div className="mypopdiv">{text.substring(0,300)+"..."}</div>);
              }
              else{
                  txt=text;
                  pop =(<div className="mypopdiv">{text}</div>);
              }
              return   <Popover content={pop}>
                          {txt}
                      </Popover> 
        break;
        case "lev":            
                  let text1 =Glteamdata[key].LevelName
                let len1=this.getBLen(text1);
                let txt1;
                let pop1;
                if(len1>10&&len1<300){
                    txt1=text1.substring(0,10)+"...";
                    pop1 =(<div className="mypopdiv">{text1}</div>);
                }
                else if (len>300 ){
                    txt1=text1.substring(0,10)+"...";
                    pop1 =(<div className="mypopdiv">{text1.substring(0,300)+"..."}</div>);
                }
                else{
                    txt1=text1;
                    pop1 =(<div className="mypopdiv">{text1}</div>);
                }
                return   <Popover content={pop1}>
                            {txt1}
                        </Popover>   
        break;
        case "devlogic":            
                  let DevType=Glteamdata[key].DevType;
                let typename=""
                  switch (DevType) {
                    case "1":
                    typename="音柱"
                      break;
                      case "2":
                      typename="多路语音合成器"
                        break;
                        case "3":
                        typename="电话短信网关"
                          break;
                          case "4":
                          typename="数字编码控制器"
                            break;
                            case "5":
                            typename="播出控制器"
                              break;
                    default:
                      break;
                  }
                  let DevLogicAddr=Glteamdata[key].DevLogicAddr;
                return   <Popover content={typename}>
                  {DevLogicAddr}
              </Popover>   
break;
      }
    }
  }

  teamcancel(){
        this.setState({teamedit:false})
    }

  teamedit(){
    this.setState({teamedit:true})
  }

  teamsave(){
    let key =this.state.currentMenukey;
    let r = {
      method: "POST",
      body: JSON.stringify({"opt":"mfyRole", "id":parseInt(key),"name":rolePostdata[key].name, "nameExt":rolePostdata[key].nameExt, "Desc":"666666", "LevelId":rolePostdata[key].LevelId, "RegionId":rolePostdata[key].RegionId,"DevLogicAddr":rolePostdata[key].DevLogicAddr,"DevType":rolePostdata[key].DevType})
    }
    netdata('/RoleOpt.epy', r).then(this.reloadteam.bind(this))
    this.setState({teamedit:false})
  }

  newRole(){
    let r = {
      method: "POST",
      body: JSON.stringify({"opt":"newRole", "name":"新建用户组", "nameExt":"新建用户组"})
    }
    netdata('/RoleOpt.epy', r).then(this.reloadteam.bind(this))
  }
  delRole(){
    // let teamdata = this.store.getState().teamdata;
    // let childlength= teamdata[this.state.currentMenukey].children.length
    // if(childlength!=0){
    //   message.error("当前用户组下包含用户，无法删除！！")
    // }
    // else{
          let r = {
      method: "POST",
      body: JSON.stringify({"opt":"delRole", "id":this.state.currentMenukey})
    }
    netdata('/RoleOpt.epy', r).then(this.reloadteam.bind(this))
    // }

  }

  changeRoleInfo(value,key,type){
    rolePostdata[key][type] =value;
  }
  renderTreeNodestree = (data) => {
  
    return data.map((item) => {   logicaddrtoId[item.id]=item.logicaddr;
      let haveregionchild = false
      let disabled =false
      item.children.map(item=>{
        if(item.eocT === 0){
          haveregionchild = true;
        }
      })
   if(item.eocT=="-1")  {
     disabled =true
   } 
      if(haveregionchild){
      if(item.eocT != 1){
        if (item.children.length != 0) {  
          return (
            <TreeNode1 title={<span>{item.logicaddr}</span>} disabled={disabled} value={item.id} key={item.id} dataRef={item}>
                {this.renderTreeNodestree(item.children)}
            </TreeNode1>
          );
        }
        else{
          return <TreeNode1 title={<span>{item.logicaddr}</span>} disabled={disabled} value={item.id} key={item.id} dataRef={item}/>
        }
      }
    }
    else{
      if(item.eocT!=1){
         return <TreeNode1 title={<span>{item.logicaddr}</span>} disabled={disabled}  value={item.id} key={item.id} dataRef={item}/>
      }
     
    }
  });
  }
  renderTreeNodes = (data) => {
        //     return data.map((item) => {
        //     let haveregionchild = false
        //     item.children.map(item=>{
        //       if(item.eocT === 0){
        //         haveregionchild = true;
        //       }
        //     })
        //     if(haveregionchild){
        //     if(item.eocT != 1){
        //       if (item.children.length != 0) {
        //         return (
        //           <TreeNode title={<span>{item.desc}</span>} value={item.id} key={item.id} dataRef={item}>
        //               {this.renderTreeNodes(item.children)}
        //           </TreeNode>
        //         );
        //       }
        //       else{
        //         return <TreeNode title={<span>{item.desc}</span>} value={item.id} key={item.id} dataRef={item}/>
        //       }
        //     }
        //   }
        //   else{
        //     return <TreeNode title={<span>{item.desc}</span>} value={item.id} key={item.id} dataRef={item}/>
        //   }
        // });

        return data.map((item) => {
          let haveregionchild = false
          item.children.map(item=>{
            if(item.eocT === 0){
              haveregionchild = true;
            }
          })
          if(haveregionchild){
          if(item.eocT != 1){
            if (item.children.length != 0) {  
              return (
                <TreeNode title={<span>{item.desc}</span>} value={item.id} key={item.id} dataRef={item}>
                    {this.renderTreeNodes(item.children)}
                </TreeNode>
              );
            }
            else{
              return <TreeNode title={<span>{item.desc}</span>} value={item.id} key={item.id} dataRef={item}/>
            }
          }
        }
        else{
          if(item.eocT!=1){
             return <TreeNode title={<span>{item.desc}</span>} value={item.id} key={item.id} dataRef={item}/>
          }
         
        }
      });




    }

  renderTreeNodesLev = (data) => {
            return data.map((item) => {
              if(typeof(item.subs)!="undefined"){
                if (item.subs.length !== 0) {
    
                return (
                  <TreeNode title={<span>{item.name}</span>} value={item.id} key={item.id} dataRef={item}>
                    {this.renderTreeNodesLev(item.subs)}
                  </TreeNode>
                );
              }
              }
              return <TreeNode title={<span>{item.name}</span>} value={item.id} key={item.id} dataRef={item}/>
            });
          }
  regionIdChange(e){
        let key = this.state.currentMenukey;
        var vx='';
        for(let i=0;i<e.length;i++){
          if(i==e.length-1){
            vx+=e[i]
          }else{
            vx+=e[i]+","
          }   
        }
        rolePostdata[key]["RegionId"] =vx;

      }
 regionlogicChange = (selectedKeys, info) => {
        let key = this.state.currentMenukey;
        rolePostdata[key]["DevLogicAddr"] =logicaddrtoId[selectedKeys[0]]
       document.getElementById("logicbutton").innerHTML=logicaddrtoId[selectedKeys[0]]
      }
      devtypehandleChange(value) {
        let key = this.state.currentMenukey;
        rolePostdata[key]["DevType"] =value
      }
  LevChange(e){
        let key = this.state.currentMenukey;
        var vx='';
        for(let i=0;i<e.length;i++){
          if(i==e.length-1){
            vx+=e[i]
          }else{
            vx+=e[i]+","
          }   
        }
        rolePostdata[key]["LevelId"] =vx;

      }
  render() {
    const treeselect =(
      <TreeSelect
      showSearch
      defaultValue={regionIdLst[this.state.currentMenukey]}
      style={{ width: "100%" }}
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      placeholder="请选择"
      allowClear
      multiple
      treeDefaultExpandAll
      treeCheckable="true"
      showCheckedStrategy={SHOW_PARENT}
      onChange={e => this.regionIdChange(e)}
    >{this.renderTreeNodes(gData)}
       </TreeSelect>
    )
    const treeselectlev =(
      <TreeSelect
      defaultValue={LevLst[this.state.currentMenukey]}
      showSearch
      style={{ width: "100%" }}
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      placeholder="请选择"
      allowClear
      multiple
      treeDefaultExpandAll
      treeCheckable="true"
      showCheckedStrategy={SHOW_PARENT}
      onChange={e => this.LevChange(e)}
    >
    {this.renderTreeNodesLev(LevData)}
            </TreeSelect>
    )
    return (
      <section id="myebody" className="e-body" style={{ height: window.innerHeight }}>
        <div className="my-content">
          <Layout>
            <Sider width={200} style={{ height: window.innerHeight - 64, background: '#fff', boxShadow: "1px 0px 6px #dcd0d0", overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }}>
              <Menu
                onClick={this.handleClick.bind(this)}
                style={{ height: '100%', borderRight: 0 }}
                // defaultSelectedKeys={"1"}
                selectedKeys={[this.state.currentMenukey]}
                mode="inline"
              >
                <MenuItemGroup key="g1" title="用户权限组" >
                  {this.menuRender(this.state.menudata)}
                </MenuItemGroup>
              </Menu>
            </Sider>
            <Layout style={{ marginLeft: 200 }}>
              <Content style={{ background: '#fff', margin: 0, minHeight: 280 }}>
                <Affix offsetTop={64}>
                  <div className="table-operations">
                    <Button icon="plus" onClick={this.newRole.bind(this)}>添加用户组</Button>
                    <Popconfirm placement="bottom" title={"确认删除?"} onConfirm={this.delRole.bind(this)} okText="是" cancelText="否">

                    <Button icon="minus">删除用户组</Button>
                    </Popconfirm>
                  {  this.state.teamedit ?<div style={{display:'inline'}}><Button style={{marginRight:'8px'}} icon="save" onClick={this.teamsave.bind(this)}>保存</Button><Button icon="close-circle-o" onClick={this.teamcancel.bind(this)}>取消</Button></div>:<Button icon="edit" onClick={this.teamedit.bind(this)}>编辑</Button>     }    
                  <div style={{marginTop:'10px',marginLeft:'10px'}}>
                  <Row>
                    <Col  sm={5}>
                      <div className='textSecondary'>名称</div>
                      <div className='heading'>{this.state.teamedit ?<Input onChange={(e)=>this.changeRoleInfo(e.target.value,this.state.currentMenukey,"name")} defaultValue={this.infoRender(this.state.currentMenukey,"name") }/>:this.infoRender(this.state.currentMenukey,"name") } </div>
                    </Col>
                    <Col  sm={5}>
                      <div className='textSecondary'>描述</div>
                      <div className='heading'>{this.state.teamedit ?<Input onChange={(e)=>this.changeRoleInfo(e.target.value,this.state.currentMenukey,"nameExt")} defaultValue={this.infoRender(this.state.currentMenukey,"desc") }/>:this.infoRender(this.state.currentMenukey,"desc") } </div>
                    </Col>
                    <Col  sm={5}>
                      <div className='textSecondary'>区域</div>
                      <div className='heading'>{this.state.teamedit ?treeselect:this.infoRender(this.state.currentMenukey,"area") } </div>
                    </Col>
                    <Col  sm={5}>
                      <div className='textSecondary'>功能</div>
                      <div className='heading'>{this.state.teamedit ?treeselectlev:this.infoRender(this.state.currentMenukey,"lev") } </div>
                    </Col>
                    <Col  sm={4}>
                      <div className='textSecondary'>设备地址绑定</div>
                      <div className='heading'>{this.state.teamedit ?<Popover placement="bottom" trigger="click"
                                                                       content={   <div style={{width:250}}>
                                                                                    <Select defaultValue={Glteamdata[this.state.currentMenukey].DevType} style={{ width: "100%" }}   onChange={this.devtypehandleChange}>
                                                                                        <Option value="1" disabled>音柱</Option>
                                                                                        <Option value="2" disabled>多路语音合成器</Option>
                                                                                        <Option value="3" disabled>电话短信网关</Option>
                                                                                        <Option value="4">数字编码控制器</Option>
                                                                                        <Option value="5" disabled>播出控制器</Option>
                                                                                    </Select>
                                                                                      <div style={{height:"250px",width: "100%",overflow: "auto",marginTop:"8px"}}> 
                                                                                      <Tree
                                                                                      defaultExpandAll
                                                                                      onSelect={this.regionlogicChange}
                                                                                        >
                                                                                        {this.renderTreeNodestree(gData)}
                                                                                      </Tree>
                                                                                      </div>
                                                                                   </div>
                                                                                    }>
                                                                          <Button id="logicbutton" style={{width:"100%"}}>{rolePostdata[this.state.currentMenukey].DevLogicAddr    }</Button>
                                                                      </Popover>
                                                                      :this.infoRender(this.state.currentMenukey,"devlogic") } </div>
                    </Col>
                  </Row>
                  </div>
                  </div>
     
                </Affix>
                {this.renderContent(this.state.currentMenukey)}
              </Content>
            </Layout>
          </Layout>

          <style>{`
          #myebody .ant-menu-item:hover{
            background-color: transparent; 
              }
            .textSecondary{
              color: rgba(0, 0, 0, 0.45);
            }  
            .heading{
              color: rgba(0, 0, 0, 0.85);
              font-size: 20px;
              width: 70%;
            }
            .table-operations {
                        padding: 8px 24px;
                        margin-left: 2px;
                    }
                    .ant-affix .table-operations {
                        padding: 8px 24px;
                        background: #fff;
                        border-bottom: 1px solid #ececec;
                        box-shadow: 0 2px 6px rgba(100, 100, 100, 0.1);
                        margin-left: 2px;
                    }
                    .table-operations > button {
                    margin-right: 8px;
                    }
            `}
          </style>
        </div>
      </section>
    )
  }
}


export default AuthConfig;