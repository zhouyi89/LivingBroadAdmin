import React from 'react';
import {  Input, Select, Button,Switch ,Table,Tag} from 'antd';


class Basicphonemodule extends React.Component {
  state={
    data1:[],
    data2:[]
  }
  componentDidMount(){
    this.props.store.subscribe(() => {
      const { deviceDATA } = this.props.store.getState();
      if(typeof(deviceDATA.CL)!=="undefined"){
          let ddd = deviceDATA.CL;
          let data1=[],data2=[];
          for (var index = 0; index < ddd.length; index++) {
            if(index<8){
              data1.push(ddd[index])
            }else{
              data2.push(ddd[index])
            } 
            
          }
          this.setState({data1:data1,data2:data2})
      }

    });

  }

  render() {
    const columns = [
      {
        title: '通道号',
        className:"aligncenter",
        dataIndex: 'Index',
        width:"10%"
      },{
      title: '采样率',
      className:"aligncenter",
      dataIndex: 'ebpSamplingRate',
      width:"15%",
    },{
      title: '码率(kBps)',
      className:"aligncenter",
      dataIndex: 'ebpDataRate',
      width:"25%",
  
    },{
      title: '信号强度',
      className:"aligncenter",
      dataIndex: 'ebpcSingle',
      width:"25%",
  
    }, {
      title: '状态',
      className:"aligncenter",
      dataIndex: 'ebpcStatus',
      width:"30%",
      render: (text, record) => {
        switch (text) {
          case "2":
               return (<Tag color="#f50">异常</Tag>)
            break;
            case "1":
            return (<Tag color="#87d068">正常</Tag>)
         break;        
         
      case "3":
         return (<Tag color="#2db7f5">通话中</Tag>
        )
      break;
          default:
            break;
        }
    } 
  }
//   , {
//     title: '操作',
//     className:"aligncenter",
//     dataIndex: 'op',
//     width:"10%",
//     render: (text, record) => {
//       return (
//         <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked={text} />
//       );
//   }
// }
];
   
    return (
      <div >
          <div className="phonemoduletable" style={{marginRight:"12px"}}> 
          <Table columns={columns} dataSource={this.state.data1} pagination={false} size="small"/>
         </div>
         <div className="phonemoduletable"> 
            <Table columns={columns} dataSource={this.state.data2} pagination={false} size="small"/>
         </div>
         <style>{`
         .phonemoduletable{
           width:49%;
           float:left;
           margin-bottom: 10px
         }
           
           `}</style>
           
      </div>
    );
  }
}

export default Basicphonemodule