import React from 'react';
import {  Input, Select, Button,Switch,Table,Tag} from 'antd';


class CannelTable extends React.Component {
  state={
    data:[],
  }
  componentDidMount(){
    this.props.store.subscribe(() => {
      const { deviceDATA } = this.props.store.getState();
      let sourcedata =[];
      let data1 ={},data2={},data3 ={},data4={},data5 ={},data6={},data7 ={},data8={};
      data1["Index"]='1'
      data1["ChannelStatus"]=deviceDATA.ChannelStatus1
      data1["ChannelMessage"]=deviceDATA.ChannelMessage1
      data2["Index"]='2'
      data2["ChannelStatus"]=deviceDATA.ChannelStatus2
      data2["ChannelMessage"]=deviceDATA.ChannelMessage2
      data3["Index"]='3'
      data3["ChannelStatus"]=deviceDATA.ChannelStatus3
      data3["ChannelMessage"]=deviceDATA.ChannelMessage3
      data4["Index"]='4'
      data4["ChannelStatus"]=deviceDATA.ChannelStatus4
      data4["ChannelMessage"]=deviceDATA.ChannelMessage4
      data5["Index"]='5'
      data5["ChannelStatus"]=deviceDATA.ChannelStatus5
      data5["ChannelMessage"]=deviceDATA.ChannelMessage5
      data6["Index"]='6'
      data6["ChannelStatus"]=deviceDATA.ChannelStatus6
      data6["ChannelMessage"]=deviceDATA.ChannelMessage6
      data7["Index"]='7'
      data7["ChannelStatus"]=deviceDATA.ChannelStatus7
      data7["ChannelMessage"]=deviceDATA.ChannelMessage7
      data8["Index"]='8'
      data8["ChannelStatus"]=deviceDATA.ChannelStatus8
      data8["ChannelMessage"]=deviceDATA.ChannelMessage8
      sourcedata.push(data1);sourcedata.push(data2);sourcedata.push(data3);sourcedata.push(data4);sourcedata.push(data5);sourcedata.push(data6);sourcedata.push(data7);sourcedata.push(data8);
      this.setState({data:sourcedata})
    });

  }
  
  render() {
    let that =this;
    const columns = [
      {
        title: '通道号',
        className:"aligncenter",
        dataIndex: 'Index',
        width:"15%"
      },{
      title: '状态',
      className:"aligncenter",
      dataIndex: 'ChannelStatus',
      width:"20%",
      render: (text, record) => {
        
            switch(text) {
              case "0":
                return (<Tag color="#87d068">空闲</Tag>)
                break;
              case "2":
                 return (<Tag color="#f50">繁忙</Tag>)
              break;
              default:
                 return text;
                break;
            }
        
    },
    }, {
      title: '内容',
      className:"aligncenter",
      dataIndex: 'ChannelMessage',
      width:"65%",
    }];

    return (
      <Table columns={columns} dataSource={this.state.data} pagination={false} bordered={true} size="small" />      
    );
  }
}

export default CannelTable