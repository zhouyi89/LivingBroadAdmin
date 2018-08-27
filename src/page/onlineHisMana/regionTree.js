import React from 'react';
import { Tree, Input,Icon } from 'antd';
import {netdata} from './../../helper';

const TreeNode = Tree.TreeNode;
const Search = Input.Search;
let treeDataDic= [];
let devices=[];
// const x = 3;
// const y = 2;
// const z = 1;
// const gData = [];


class regionTree extends React.Component {
  state = {
    expandedKeys: [],
    searchValue: "",
    autoExpandParent: true,
    gData: [],
    Slectkey:"-1",
    SlectName:"",
    loading:false
  };

  renderTreeNodes = data => {
    if (data.length === 0) return <TreeNode title="路通应急广播管理系统" />;
    return data.map(item => {
      let haveregionchild = false;
      item.children.map(item => {
        if (item.eocT === 0) {
          haveregionchild = true;
        }
      });
      const title = (
        <span>
          <Icon type="cloud-o" style={{ marginRight: "5px" }} />
          <span>{item.desc}</span>
        </span>
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
        if(item.eocT!=1){
          return <TreeNode title={title} key={item.id} value={item.desc} />;
        }
        
      }
    });
  };
  componentDidMount() {
      this.reload();
  }
reload(){
  let that=this;
      let r = {
      method: "POST",
      body: JSON.stringify({ opt: "getTree" })
    };
    netdata("/topoly/regionTreeOpt.epy", r).then(that.ondata.bind(this));
}
  ondata(res) {
    if (res.s === false) {
      Notification["error"]({
        message: "数据请求错误",
        description: JSON.stringify(res.d)
      });
      return;
    }
    if (res.d.errCode == 0) {
      if(this.state.SlectName===''){
        this.setState({SlectName: res.d.Values[0].desc})
      }
      
      this.setState({ gData: res.d.Values });
      // this.getTreeDic(res.d.Values);
      // let devicesList=  this.initdevicedata(treeDataDic[this.state.Slectkey]);
      const { store } = this.props;
      store.setState({ regionname: this.state.SlectName});
    } else {
    }
  }


  onSelect = (selectedKeys, info) => {
    this.setState({Slectkey:selectedKeys,SlectName: info.node.props.value})
    if(selectedKeys.length==0){
      return;
    }
    const { store } = this.props;
    store.setState({ regionname: info.node.props.value,Slectkey:selectedKeys});
    
  };
  render() {
    const { searchValue, expandedKeys, autoExpandParent } = this.state;

    return (
      <div style={{ margin: "12px" }}>
        {/* <Search style={{ marginBottom: 8 }} placeholder="搜索区域" /> */}
        <Tree
          onSelect={this.onSelect.bind(this)}
          defaultExpandAll={true}
          autoExpandParent={autoExpandParent}
          defaultSelectedKeys={["-1"]}
        >
          {this.renderTreeNodes(this.state.gData)}
        </Tree>
      </div>
    );
  }
}

export default regionTree;