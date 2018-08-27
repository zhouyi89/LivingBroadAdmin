import React from 'react';
import {  Input, Select, Button,Switch,Table,Tag} from 'antd';


class Basicauthmember extends React.Component {
  state={
    data:[]
  }

  componentDidMount(){
    this.props.store.subscribe(() => {
      const { deviceDATA } = this.props.store.getState();
      this.setState({data:deviceDATA.PC})
    });

  }

  render() {
    const columns = [
      {
        title: '序号',
        className:"aligncenter",
        dataIndex: 'Index',
        width:"15%"
      },{
      title: '电话号码',
      className:"aligncenter",
      dataIndex: 'ebpPhoneNumber',
      width:"20%",
    }, {
      title: '密码',
      className:"aligncenter",
      dataIndex: 'ebpPhonePassword',
      width:"20%",
    },
    // {
    //   title: '校验方式',
    //   className:"aligncenter",
    //   dataIndex: 'authcheck',
    //   width:"15%",
    //   render: (text, record) => {
    //     switch (text) {
    //       case 1:
    //            return (<Tag color="#f50">异常</Tag>)
    //         break;
    //         case 2:
    //         return (<Tag color="#87d068">正常</Tag>)
    //      break;        
         
    //   case 3:
    //      return (<Tag color="#2db7f5">通话中</Tag>
    //     )
    //   break;
    //       default:
    //         break;
    //     }
    // } 
    // },
     {
      title: '区域映射',
      className:"aligncenter",
      dataIndex: 'ebpZoneMapping',
      width:"30%",
  }
];
    
    return (
          <Table columns={columns}  dataSource={this.state.data}  pagination={{
            pageSize: 10, showQuickJumper: true}} size="small"/>
    );
  }
}

export default Basicauthmember