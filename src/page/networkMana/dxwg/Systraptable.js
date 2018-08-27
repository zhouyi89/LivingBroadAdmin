import React from 'react';
import {  Input, Select, Button,Switch,Table,message,Form} from 'antd';

const FormItem = Form.Item;
class Systraptable extends React.Component {
  state={
    data:[],
    iperror:{
      '1':"",
      '2':"",
      '3':"",
      '4':"",
    },
    ipdata:{
      '1':"",
      '2':"",
      '3':"",
      '4':"",
    },
    comdata:{
      '1':"",
      '2':"",
      '3':"",
      '4':"",
    },
    TrapStatus:{
      '1':"",
      '2':"",
      '3':"",
      '4':"",
    }
  }
isValidIP(ip) {
    var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
    return reg.test(ip);
} 
  componentDidMount(){
    this.props.store.subscribe(() => {
      this.setState({    iperror:{
        '1':"",
        '2':"",
        '3':"",
        '4':"",
      }})
      const { deviceDATA } = this.props.store.getState();
      let sourcedata =[];
      let data1 ={},data2={},data3 ={},data4={};
      data1["Index"]='1'
      data1["lt2IpaTrapCommunity"]=deviceDATA.lt2IpaTrapCommunity1
      data1["lt2IpaTrapIP"]=deviceDATA.lt2IpaTrapIP1
      data1["lt2IpaTrapStatus"]=deviceDATA.lt2IpaTrapStatus1
      data2["Index"]='2'
      data2["lt2IpaTrapCommunity"]=deviceDATA.lt2IpaTrapCommunity2
      data2["lt2IpaTrapIP"]=deviceDATA.lt2IpaTrapIP2
      data2["lt2IpaTrapStatus"]=deviceDATA.lt2IpaTrapStatus2
      data3["Index"]='3'
      data3["lt2IpaTrapCommunity"]=deviceDATA.lt2IpaTrapCommunity3
      data3["lt2IpaTrapIP"]=deviceDATA.lt2IpaTrapIP3
      data3["lt2IpaTrapStatus"]=deviceDATA.lt2IpaTrapStatus3
      data4["Index"]='4'
      data4["lt2IpaTrapCommunity"]=deviceDATA.lt2IpaTrapCommunity4
      data4["lt2IpaTrapIP"]=deviceDATA.lt2IpaTrapIP4
      data4["lt2IpaTrapStatus"]=deviceDATA.lt2IpaTrapStatus4
      sourcedata.push(data1);sourcedata.push(data2);sourcedata.push(data3);sourcedata.push(data4);
      let ipdata =this.state.ipdata;
      ipdata['1']=deviceDATA.lt2IpaTrapIP1;
      ipdata['2']=deviceDATA.lt2IpaTrapIP2;
      ipdata['3']=deviceDATA.lt2IpaTrapIP3;
      ipdata['4']=deviceDATA.lt2IpaTrapIP4;
      let comdata =this.state.comdata;
      comdata['1']=deviceDATA.lt2IpaTrapCommunity1;
      comdata['2']=deviceDATA.lt2IpaTrapCommunity2;
      comdata['3']=deviceDATA.lt2IpaTrapCommunity3;
      comdata['4']=deviceDATA.lt2IpaTrapCommunity4;
      let TrapStatus =this.state.TrapStatus;
      TrapStatus['1']=deviceDATA.lt2IpaTrapStatus1;
      TrapStatus['2']=deviceDATA.lt2IpaTrapStatus2;
      TrapStatus['3']=deviceDATA.lt2IpaTrapStatus3;
      TrapStatus['4']=deviceDATA.lt2IpaTrapStatus4;
      this.setState({data:sourcedata,ipdata:ipdata,comdata:comdata,TrapStatus:TrapStatus})
      });

  }
  subDATA(){

    let error =this.state.iperror
    let errortag=false;
    for(let ii in error){
      if(error[ii]==="error"){
        errortag=true;
      }
    }
    if(errortag){
          return "error";
    }
    else{
          let DATA=[];
          DATA.push(this.state.ipdata)
          DATA.push(this.state.comdata)
          DATA.push(this.state.TrapStatus)
          return DATA;
    }

  }
  comchange(e){
    let comdata =this.state.comdata;
    comdata[e.target.name]=e.target.value;
    this.setState({comdata:comdata})
  }
  ipchange(e){
    if(!this.isValidIP(e.target.value)){
      let iperror =this.state.iperror;
      iperror[e.target.name]="error";
      this.setState({iperror:iperror})
    }
    else{
      let iperror =this.state.iperror;
      iperror[e.target.name]="success";
      this.setState({iperror:iperror})
    }
    let ipdata =this.state.ipdata;
    ipdata[e.target.name]=e.target.value;
    this.setState({ipdata:ipdata})
  }
  Statuschange(id,st){  
    let TrapStatus =this.state.TrapStatus;
    TrapStatus[id]=st?"1":"2";
    this.setState({TrapStatus:TrapStatus})
  }
  render() {
    let that =this;
    const columns = [
      {
        title: 'AgentTrap表',
        className:"aligncenter",
        dataIndex: 'Index',
        width:"15%"
      },{
      title: 'IP地址',
      className:"aligncenter",
      dataIndex: 'lt2IpaTrapIP',
      width:"40%",
      render: (text, record) => {
          return (
            <FormItem
            hasFeedback
            validateStatus={this.state.iperror[record.Index]}
          >
            <Input
              value={this.state.ipdata[record.Index]} onChange={this.ipchange.bind(that)} name={record.Index}
            />
            </ FormItem>
          );
      },
    }, {
      title: '社区串',
      className:"aligncenter",
      dataIndex: 'lt2IpaTrapCommunity',
      width:"35%",
      render: (text, record) => {
        return (
          <Input
            value={this.state.comdata[record.Index]}  onChange={this.comchange.bind(that)} name={record.Index}
          />
        );
    },
    }, {
      title: 'Trap状态',
      className:"aligncenter",
      dataIndex: 'lt2IpaTrapStatus',
      width:"10%",
      render: (text, record) => {
        
        return (
          <Switch checkedChildren="开" unCheckedChildren="关" onChange={this.Statuschange.bind(that,record.Index)} name={record.Index} checked= {this.state.TrapStatus[record.Index]=="1"?true:false}  />
        );
    },
    }];

    return (
      <Table columns={columns} dataSource={this.state.data} pagination={false} bordered={true} size="small" />      
    );
  }
}

export default Systraptable