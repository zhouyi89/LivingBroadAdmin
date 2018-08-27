import React from 'react';
import {  Input, Select, Button,Switch,Table,Tag} from 'antd';
const Option = Select.Option;

class radchTable extends React.Component {
  state={
    data:[],
    chcheck:""
  }
  componentDidMount(){
    this.props.store.subscribe(() => {
      const { deviceDATA } = this.props.store.getState();
      let sourcedata =[];
      let data1 ={},data2={},data3 ={},data4={};
      data1["Index"]='1'
      data1["TimbreName"]=deviceDATA.TimbreName1
      data2["Index"]='2'
      data2["TimbreName"]=deviceDATA.TimbreName2
      data3["Index"]='3'
      data3["TimbreName"]=deviceDATA.TimbreName3
      data4["Index"]='4'
      data4["TimbreName"]=deviceDATA.TimbreName4
      sourcedata.push(data1);sourcedata.push(data2);sourcedata.push(data3);sourcedata.push(data4);
      this.setState({data:sourcedata,chcheck:deviceDATA.TimbreSelect})
    });
    

  }
  handleChange(e){
    this.setState({chcheck:e})
  }
  subDATA(){
    let DATA=[];
    DATA.push(this.state.chcheck)
    return DATA;
  }
  render() {
    let that =this;
    const columns = [
      {
        title: '通道号',
        className:"aligncenter",
        dataIndex: 'Index',
        width:"10%"
      },{
      title: '音色名称',
      className:"aligncenter",
      dataIndex: 'TimbreName',
      width:"80%",
      render: (text, record) => {
             return (<Tag color="#87d068">{text}</Tag>)
        
    },
    }
  ];

    return (
      <div style={{width:"50%"}}> 
      <Table columns={columns} dataSource={this.state.data} pagination={false} title={false} bordered={true} size="small" />  
      <div style={{marginTop:"10px"}}> 
      <Select value={this.state.chcheck} style={{ width: 120 }} onChange={this.handleChange.bind(this)}>
      <Option value="1">通道1</Option>
      <Option value="2">通道2</Option>
      <Option value="3">通道3</Option>
      <Option value="4">通道4</Option>
        </Select>   
        </div> 
      </div>
    );
  }
}

export default radchTable