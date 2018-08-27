import React from 'react';
import { Tag, Tooltip,Button,TreeSelect  } from 'antd';
import {netdata} from './../../helper';

const SHOW_PARENT = TreeSelect.SHOW_PARENT;
const TreeNode = TreeSelect.TreeNode;
let gData;
let treeDataDic=[];
class regionTag extends React.Component {
  state = {
    Visible: true,
    inputValue: '',
    tagsID:[]
  };
  GETregion (){
    return this.state.tagsID
  }
  handleClose = (removedTag) => {
    const tagsID = this.state.tagsID.filter(tag => tag !== removedTag);
    this.setState({ tagsID });
  }

  clickmodify= ()=>{

    this.setState({ Visible:!this.state.Visible });

  }

  componentWillMount(){


  }

  componentDidMount(){  
      this.props.store.subscribe(() => {
        const { BroadcastData,id } = this.props.store.getState();
        // this.setState({Name:BroadcastData[id].Name})
        //this.setState({tagsID:BroadcastData[id].Region.split(",")})

        let tIDs=BroadcastData[id].Region.split(",");
        let mytIDs=[];
        for(let i=0;i<tIDs.length;i++){
            mytIDs.push(parseInt(tIDs[i]))
        }
        this.setState({tagsID:mytIDs})
      });
    var that = this;
    let r = {
      method: "POST",
      body: JSON.stringify({"opt":"getTree"})
    }
    netdata('/topoly/regionTreeOpt.epy', r).then(this.ondata.bind(this))
  }

  ondata(res) {
    if (res.s === false) {
      Notification['error']({
        message: '数据请求错误',
        description: JSON.stringify(res.d),
      });
      return;
    }
    if(res.d.errCode == 0){
     gData = res.d.Values;
     this.getTreeDic(gData);
    }
    else{

    }
  }
  getTreeDic =(data)=>{
    return data.map((item) => {
      treeDataDic[item.id]=item.desc
      if (item.children.length != 0) {  
        this.getTreeDic(item.children)
      }
    })
  }


  renderTreeNodes = (data) => {
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
onChange = (value) => {
   this.setState({tagsID: value });
}

  render() {
    const { tagsID, Visible, inputValue,tt } = this.state;
    const tProps = {       
        treeCheckable: true,
        showCheckedStrategy: SHOW_PARENT,
        searchPlaceholder: '请选择区域',
        style: {
          width: 700,
        },
        onChange: this.onChange,
        value:tagsID
      };
    return (
      <div id="tagid">     
{  Visible?    
      <Button className="" onClick={this.clickmodify} type="primary" icon="edit" style={{height:"38px",marginRight:"20px "}}>增加区域</Button>
: <Button className="" onClick={this.clickmodify} type="primary" icon="save" style={{height:"38px",marginRight:"20px "}}>退出编辑</Button>
}        {  Visible?
            tagsID.map((tag, index) => {
            const isLongTag = tag.length > 10;
            let tagElem =null;
            if(typeof(treeDataDic[parseInt(tag)])!="undefined"){
               tagElem = (
            <Tag key={tag} color="cyan" closable={true} afterClose={() => this.handleClose(tag)}>
                {isLongTag ? `${treeDataDic[parseInt(tag)].slice(0, 10)}...` : treeDataDic[parseInt(tag)]}
            </Tag>
            );
            }

            return isLongTag ? <Tooltip title={treeDataDic[tag]} key={tag}>{tagElem}</Tooltip> : tagElem;
        })  :<TreeSelect {...tProps} >{this.renderTreeNodes(gData)}</TreeSelect>
        }
         <style>{`
         #tagid .ant-tag{
            line-height: 32px;    
             height: 34px;
         }
         .ant-tag-cyan {
    color: #13c2c2;
    background: #e6fffb;
    border-color: #87e8de;
}
.ant-tag-blue {
    color: #1890ff;
    background: #e6f7ff;
    border-color: #91d5ff;
}
        `}</style>   

      </div>
    );
  }
}

export default regionTag