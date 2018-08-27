import React from 'react'
import { Table , Button ,Slider,notification,message,Popconfirm,Tooltip,Tag,Popover,Spin} from 'antd'
import {netdata} from './../../helper'
import { withRouter } from 'react-router'

var rr;
let indexGL;
const DetailTable= withRouter (  class DetailTable extends React.Component{
  state={
    sourcedata:[],
    count:5,
    loadmore:[],
    loadingMore:false
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
  removeitem=(record)=>{
    if(indexGL==record.Index){
      document.getElementById("playershow").setAttribute("class","");
    this.props.setSet({livesrc:""})}
    var that =this;
       // var rowids=selectedRows.map(row => row.key);
    rr =record;
  //   let data = this.state.sourcedata.filter(item =>item.key!==record.key );
  //   console.log(data)
  //   this.setState({ sourcedata: data });
  //  alert(index)
  let r = {
    method: "POST",
    body: JSON.stringify({"opt":"DelBroadcast","Index":record.Index})
  }
  netdata('/BroadcastOpt.epy', r).then(
    this.ondatadelete.bind(that)
  )


  }
  ondatadelete(res){
    if(res.d.errCode === "Cookie过期"){
      this.props.history.replace('/power')
    }
    if(res.d.errCode == 0){
      
          // let data = this.state.sourcedata.filter(item =>item.Index!==rr.Index );
          // this.setState({ sourcedata: data });
          // const { store } = this.props;
          // store.setState({ livelistsource: data });
          this.props.reloadtable();
          notification["success"]({
            message: "删除成功！",
            description: "",
            duration:1.5,
          });
    }
    else{
      
      notification["error"]({
        message: res.d.errCode,
        description: "",
        duration:1.5
      });
      this.props.reloadtable();
    }
  }

  showplayer=(record)=>{
    indexGL=record.Index;
    message.success('监听开始-序号'+record.Index,1);
      this.props.setSet({livesrc:"./httpflv.html?index="+record.Index})
      document.getElementById('playershowname').innerHTML="序号"+record.Index;
      document.getElementById("playershow").setAttribute("class","playershowon");
  }
  pauseplayer=(record)=>{
    indexGL="";
    message.info('监听结束-序号'+record.Index,1);
    this.props.setSet({livesrc:""})
    document.getElementById("playershow").setAttribute("class","");
  }
  componentDidMount(){
    var that =this;
    this.props.store.subscribe(() => {
      const { livelistsource } = this.props.store.getState();
      that.setState({ sourcedata: livelistsource });
    });

  }; 
  onAfterChange(index,value){
    let that =this;
    let r = {
      method: "POST",
      body: JSON.stringify({"Index":index.toString(),"Volume":value.toString()})
    }
    netdata('/MfyVolumeOpt.epy', r).then(
      this.ondataMfyVolume.bind(that)
    )

  }
  ondataMfyVolume(res){
    if(res.d.errCode === "Cookie过期"){
      this.props.history.replace('/power')
    }
    if(res.d.errCode == 0){
          // notification["success"]({
          //   message: "修改成功！",
          //   description: "",
          //   duration:1.5,
          // });
    }
    else{
      notification["error"]({
        message: res.d.errCode,
        description: "",
        duration:1.5
      });
      this.props.reloadtable();
    }
  }

  loadmore(id){
    let that =this;
    if(id==''){
      notification["error"]({
        message: "设备没有更多信息！",
        description: "",
        duration:1.5,
      });
      return ;
    }
    this.setState({loadingMore:true})
    let r = {
      method: "POST",
      body: JSON.stringify({"opt": "UpdateDev", "id":id.toString(),"cksnmp":"0"})
      // body: JSON.stringify({"opt": "UpdateDev", "id":"1451","cksnmp":"0"})
    }
    netdata('/NMS/UpdateDevs.epy', r).then(that.ondata.bind(this,id));
   
  }

  ondata(id,res) {
    if (res.d.errCode == 0) {

        let Vs = res.d.Body;
       this.setState({loadmore:Vs,loadingMore:false})
      //   this.reload();          
    }
    else{
      message.error(res.d.Body);  
    }
}



  rendermore(dd){
    if(dd.length!=0)
      {return (<div>
        <li>
                <span>
                  MAC地址：
                </span>
                {dd.ebcHardAddr}
            </li>
        <li>
                <span>
                  软件版本号：
                </span>
                {dd.ebcSoftVersion}
            </li>
            <li>
            <span>
              硬件版本号：
            </span>
            {dd.ebcHardVersion}
             </li>
             <li>
            <span>
              生产商：
            </span>
            {dd.ebcManufacturer}
             </li>
             <li>
            <span>
              型号：
            </span>
            {dd.ebcModelNumber}
             </li>
             <li>
            <span>
            序列号：
            </span>
            {dd.ebcSerialNo}
             </li>
            </div>
          )}
  }
  render(){
    const { sourcedata } = this.state;
    const columns = [
      {
        title: '序号',
        dataIndex: 'Index',
        width:50,
      },
      // {
      //   title: '广播单位',
      //   width:65,
      //   dataIndex: 'name',
      // }, 
      {
        title: '类型',
        dataIndex: 'Mode',
        width: 100,
        render: (text, record, index) =>{switch(text){
            case 1:
              return "文件广播"
              break;
            case 2:
              return "设备广播"
              break;
            case 3:
              return "短讯广播"
              break;
            case 5:
              return "网络广播"
              break;
            case 6:
              return "电话广播"
              break;

        }} 
      },  
      {
        title: '广播信息',
        dataIndex: 'Info',
        width: 150,
        render:(text,record,index)=>{
        
          if(record.Mode===2){ 
             let sts =JSON.parse(text);
             let type =sts.PhyAddr.substring(0,4) 
             let nametype;
             let color;
             switch (type) {
               case "1181":
                 nametype="数字编码控制器";
                 color="cyan"
                 break;
                 case "1188":
                 nametype="多路语音合成器";
                 color="blue"
                 break;
                 case "1191":
                 nametype="电话短信网关";
                 color="magenta"
                 break;
                 case "1192":
                 nametype="播控机";
                 color="green"
                 break;
               default:
                 break;
             }
  
            //  if(sts.id==""){    
                    const content = (
                      <div className="roomContent" style={{padding: "0px 8px"}}>
                          {/* <img src={typesrc} style={contstyle}/> */}
                          <ul className="roomContList">
                              <li>
                                  <span>
                                      逻辑地址：
                                  </span>
                                  {sts.LogicAddr}
                              </li>
                              <li>
                                  <span>
                                    物理地址：
                                  </span>
                                  {sts.PhyAddr}
                              </li>
                              <li>
                                  <span>
                                    IP地址：
                                  </span>
                                  {sts.IPAddr}
                              </li>
                              {this.rendermore(this.state.loadmore)}
                          </ul>
                          
                          {this.state.loadingMore && <Spin />}
                          {!this.state.loadingMore && <a onClick={this.loadmore.bind(this,sts.id)}>{this.state.loadmore.length==0? "加载更多信息":"刷新"}</a>}               
                      </div>
                    );
                if(sts.Name==""){
                  return      <Popover
                                content={content}
                                title={nametype}
                                trigger="click"
                              >
                                    <Tag className={color}>{nametype}</Tag>
                              </Popover>
                        
                }
                else{
                    // return <Tag className={color}>{this.cutstr(sts.Name,5)}{"("+nametype+")"}</Tag>
                    return  <Popover
                    content={content}
                    title={sts.Name+"("+nametype+")"}
                    trigger="click"
                  >
                        <Tag className={color}>{this.cutstr(sts.Name,10)}</Tag>
                  </Popover>
                }

             }

           
          // }
          else{
              return (<div className="lineclamp" title={text}>{text}</div>) 
          }
        }  
      }, 
      {
        title: '音量',
        dataIndex: 'Volume',
        width: 70,
         render: (text, record, index) =>{let v = document.getElementById("vol"+record.Index);  if(v!=null){v.querySelector(".ant-slider-track").setAttribute("style","visibility: visible; left: 0%; width: "+(text/8)*25 +"%;");v.querySelector(".ant-slider-handle").setAttribute("style","left: "+(text/8)*25 +"%;"); };return <div id={"vol"+record.Index}><Slider size="small" disabled={!this.props.Auth[1]} onAfterChange={this.onAfterChange.bind(this,record.Index)}  defaultValue={text} min={0} max={32} step={8} /></div>},     
      },  
      {
        title: '终端',
        width: 200,
        dataIndex: 'TerminalName',
        render:(text,record,index)=>{
          let len =text.length;
          var tt = text.reduce(function (finalList, char,index) { 
            if(index==len-1){
              finalList+=char
            }
            else{
              finalList+=char+','
            }      
          return finalList;
         }, "");
          return (<div className="lineclamp" title={tt}>{tt}</div>) 
        }

      },  
      {
        title: '级别',
        width: 50,
        dataIndex: 'EBM_Lever',

      },   
      {
        title: '广播开始时间',
        dataIndex: 'StartTime',
        width: 150,
      },   
      {
        title: '创建者',
        dataIndex: 'Operator',
        width: 100,
        render:(text,record,index)=>{
          if(text!==null)
          {return <Tag>{this.cutstr(text,5)}</Tag>}

        }
      }, 
      {
        title: '监听控制',
        dataIndex: 'control',
         width:70,
        // fixed: 'right',
        render: (text, record, index) =>
        record.Mode===5?<div >
          <Tooltip mouseEnterDelay={1} title="监听播放">
           <Button disabled style={{borderColor:'#5f6477',marginRight:'4px'}} size="small"  shape="circle"  icon="caret-right"  onClick={()=>this.showplayer(record)} />
           </Tooltip>     
            <Tooltip mouseEnterDelay={1} title="监听暂停">
          <Button disabled style={{borderColor:'#5f6477',marginRight:'4px'}} size="small"  shape="circle" icon="pause"  onClick={()=>this.pauseplayer(record)} /> 
          </Tooltip>     
            </div>:<div >
            <Tooltip mouseEnterDelay={1} title="监听播放">
               <Button style={{borderColor:'#5f6477',marginRight:'4px'}} size="small"  shape="circle" icon="caret-right"  onClick={()=>this.showplayer(record)} />
            </Tooltip>     
            <Tooltip mouseEnterDelay={1} title="监听暂停">
            <Button style={{borderColor:'#5f6477',marginRight:'4px'}} size="small"  shape="circle" icon="pause"  onClick={()=>this.pauseplayer(record)} /> 
            </Tooltip>
          </div>,
      },
      {
        title: '移除广播',
        dataIndex: 'address',
         width:70,
        // fixed: 'right',
        render: (text, record, index) =>
          <div>
          {this.props.Auth[0]? <Popconfirm title="是否删除这条广播？" onConfirm={()=>this.removeitem(record)} okText="是" cancelText="否">
          <Tooltip mouseEnterDelay={1} title="移除">
          <Button   style={{borderColor:'#5f6477'}} size="small"   shape="circle" icon="close"/>
          </Tooltip>
            </Popconfirm>:null}
          </div>

      }
      
    ];
    return(
      <div>
      {/* <Button type="primary" shape="circle" icon="plus" onClick={this.addsource}/> */}
      {/* <Table columns={columns} dataSource={sourcedata} size="small" pagination={false} scroll={this.props.scroll}/> */}
      <Table scroll={{y:this.props.scoll}} columns={columns} dataSource={sourcedata} pagination={false} bordered/>
      <style>{`
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


                    .roomContent ul {
                        overflow: hidden;
                        line-height: 28px;
                    }
                    .roomContent ul.roomContList li {
                        float: none;
                        width: 100%;
                    }
                    .roomContent ul li span {
                        color: #999;
                    }
                    .roomContent ul li {
                        float: left;
                        width: 50%;
                        height: 28px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }



`}</style>
      </div>
    )    
  }
}
)
export default DetailTable