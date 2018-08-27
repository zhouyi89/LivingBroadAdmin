import React from 'react';
import { Tree  } from 'antd';
import { withRouter } from 'react-router'
import {netdata} from './../../helper';
import area1 from './3.png';
import area2 from './4.png';
import area3 from './10.png';
const TreeNode = Tree.TreeNode;
let gData = [];
let localexpandedKeys=[]
const treeview= withRouter(  class treeview extends React.Component {
  state = {
    selectedKeys: [],
    data:[],
    treecheckedKeys:[],
    loading: false
  }
  componentDidMount () {
    this.props.store.subscribe(() => {
      const { checkedKeystore } = this.props.store.getState();
      this.setState({ treecheckedKeys: checkedKeystore });
    });
     this.setState({loading: true})
    //  localCheckedKeys= localStorage.checkedKeys.split(',');
    //  this.setState({treecheckedKeys:localCheckedKeys})
  }
  componentWillMount () {
    let r = {
      method: "POST",
      body: JSON.stringify({"opt":"getTree"})
    }
    netdata('/topoly/regionTreeOpt.epy', r).then(this.ondata.bind(this))

   localexpandedKeys= localStorage.expandedKeysIndex.split(',');
   
  }

  ondata(res) {
    if(res.d.errCode === "Cookie过期"){
      this.props.history.replace('/power')
    }
    let sd = {loading: false}
    // if (res.s === false) {
    //   Notification['error']({
    //     message: '数据请求错误',
    //     description: JSON.stringify(res.d),
    //   });
    //   this.setState(sd)
    //   return;
    // }
    if(res.d.errCode == 0){
      gData = res.d.Values;
    }
    else{

    }
    try {
          sd.data = gData;
    const { store } = this.props;
    store.setState({ rootlogicaddr: gData[0].children[0].logicaddr });
    this.setState(sd);
    } catch (error) {
      
    }

  }
  onExpand = (expandedKeys) => {
    localStorage.expandedKeysIndex =expandedKeys;
    // this.setState({
    //   expandedKeys,
    //   autoExpandParent: false,
    // });
  }

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
  onCheck = (checkedKeys,e) => {
    localStorage.checkedKeysIndex =checkedKeys;
    const { store } = this.props;
    const { markerDic } = store.getState();
    for(let dd in markerDic){
      if(dd===e.node.props.eventKey){
        console.log(markerDic[dd])
        this.props.setSet({devicetitle:markerDic[dd].desc+"("+markerDic[dd].logicaddr+")",devicelatlng:markerDic[dd].latitude+","+markerDic[dd].longitude
      ,deviceinfo:"IP地址："+markerDic[dd].NetManageIp+",snmp版本："+markerDic[dd].SnmpVer+",可网管："+markerDic[dd].IsNetworkManage
      })
        this.removeClass(document.getElementById("deviceInfobox"), "close");
      }

    }
    const { checkedKeystore } = store.getState();
    store.setState({ checkedKeystore: checkedKeys ,clearlayer:true});
    this.setState({ treecheckedKeys: checkedKeys });
  }
  onSelect = (selectedKeys, info) => {
    this.setState({ selectedKeys });
  }
  renderTreeNodes = (data) => {
        if(data.length === 0)
          return <TreeNode title="路通应急广播管理系统"/>;
        return data.map((item) => {
          var Png = ""
          if(item.eocT == -1)
            Png = area1
          else if(item.eocT == 0)
            Png = area2
          else
            Png = area3
          if (item.children.length !== 0) {
            return (
              <TreeNode title={<span><img src={Png} style={{height:'14px',marginRight:"5px",opacity: 0.7}} />{item.desc}</span>} key={item.id}>
                {this.renderTreeNodes(item.children)}
              </TreeNode>
            );
          }
          if((item.eocT==1&&item.DevType=="1")||item.eocT==0){
            return <TreeNode title={<span><img src={Png} style={{height:'14px',marginRight:"5px",opacity: 0.7}} />{item.desc}</span>} key={item.id} />           
          }
        });
      }
  render() {
    return (
      <Tree checkable onCheck={this.onCheck.bind(this)} selectable={false}
      onExpand={this.onExpand}
      defaultExpandedKeys={localexpandedKeys}
      checkedKeys={this.state.treecheckedKeys}>
        {this.renderTreeNodes(gData)}
      </Tree>
    );
  }
}
)
export default treeview;