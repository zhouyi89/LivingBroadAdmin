import React from 'react';
import {  Input, Select, Button,Switch,Table} from 'antd';

const Option = Select.Option;
class QAMtable extends React.Component {
  state={
    data:[],
    freq:{
      '1':"",
      '2':""
    },
    QAM:{
      '1':"",
      '2':""
    },
    symbol:{
      '1':"",
      '2':""
    },
    mode:{
      '1':"",
      '2':""
    }
  }
  componentDidMount(){
    this.props.store.subscribe(() => {
      const { deviceDATA } = this.props.store.getState();
      let sourcedata =[];
      let data1 ={},data2={}
      data1["Index"]='1'
      data1["ebsDigitalFrequency"]=deviceDATA.ebsDigitalFrequency1
      data1["ebsDigitalQAM"]=deviceDATA.ebsDigitalQAM1
      data1["ebsDigitalSymbolrate"]=deviceDATA.ebsDigitalSymbolrate1
      data1["ebsDigitalMode"]=deviceDATA.ebsDigitalMode1
      data2["Index"]='2'
      data1["ebsDigitalFrequency"]=deviceDATA.ebsDigitalFrequency2
      data1["ebsDigitalQAM"]=deviceDATA.ebsDigitalQAM2
      data1["ebsDigitalSymbolrate"]=deviceDATA.ebsDigitalSymbolrate2
      data1["ebsDigitalMode"]=deviceDATA.ebsDigitalMode2
      sourcedata.push(data1);sourcedata.push(data2);
      let freq =this.state.freq;
      freq['1']=deviceDATA.ebsDigitalFrequency1;
      freq['2']=deviceDATA.ebsDigitalFrequency2;
      let QAM =this.state.QAM;
      QAM['1']=deviceDATA.ebsDigitalQAM1;
      QAM['2']=deviceDATA.ebsDigitalQAM2;
      let symbol =this.state.symbol;
      symbol['1']=deviceDATA.ebsDigitalSymbolrate1;
      symbol['2']=deviceDATA.ebsDigitalSymbolrate2;
      let mode =this.state.mode;
      mode['1']=deviceDATA.ebsDigitalMode1;
      mode['2']=deviceDATA.ebsDigitalMode2;
       this.setState({data:sourcedata,freq:freq,QAM:QAM,symbol:symbol,mode:mode})
      });

  }
  subDATA(){
    let DATA=[];
    DATA.push(this.state.freq)
    DATA.push(this.state.QAM)
    DATA.push(this.state.symbol)
    DATA.push(this.state.mode)
    return DATA;
  }
  modechange(name,value){
    let mode =this.state.mode;
    mode[name]=value;
    this.setState({mode:mode})
  }
  freqchange(e){
    let freq =this.state.freq;
    freq[e.target.name]=e.target.value;
    this.setState({freq:freq})
  }
  symbolchange(e){
    let symbol =this.state.symbol;
    symbol[e.target.name]=e.target.value;
    this.setState({symbol:symbol})
  }
  QAMchange(name,value){  
    let QAM =this.state.QAM;
    QAM[name]=value;
    // TrapStatus[id]=st?"1":"2";
    this.setState({QAM:QAM})
  }
  render() {
    let that =this;
    const columns = [
      {
        title: '',
        className:"aligncenter",
        dataIndex: 'Index',
        width:"10%"
      },{
      title: '数字频率KHZ',
      className:"aligncenter",
      dataIndex: 'ebsDigitalFrequency',
      width:"20%",
      render: (text, record) => {
          return (
            <Input
              value={this.state.freq[record.Index]} onChange={this.freqchange.bind(that)} name={record.Index}
            />
          );
      },
    }, {
      title: '数字QAM',
      className:"aligncenter",
      dataIndex: 'ebsDigitalQAM',
      width:"25%",
      render: (text, record) => {
        return (

          <Select value={this.state.QAM[record.Index]} style={{ width: "100%" }} onChange={this.QAMchange.bind(that,record.Index)}>
          <Option value="1">16QAM</Option>
          <Option value="2">32QAM</Option>
          <Option value="3">64QAM</Option>
          <Option value="4">128QAM</Option>
          </Select>
        );
    },
    }, {
      title: '数字符号率',
      className:"aligncenter",
      dataIndex: 'ebsDigitalSymbolrate',
      width:"25%",
      render: (text, record) => {
        
        return (
          <Input
          value={this.state.symbol[record.Index]}  onChange={this.symbolchange.bind(that)} name={record.Index}
        />
                );
    },
    }, {
      title: '数字模式',
      className:"aligncenter",
      dataIndex: 'ebsDigitalMode',
      width:"20%",
      render: (text, record) => {
        
        return (
                  <Select value={this.state.mode[record.Index]} style={{ width: "100%"}} onChange={this.modechange.bind(that,record.Index)} >
                  <Option value="1">DVBC</Option>
                  <Option value="2">DMPT</Option>
                  </Select>
                );
    },
    }];

    return (
      <Table columns={columns} dataSource={this.state.data} pagination={false} bordered={true} size="middle" />      
    );
  }
}

export default QAMtable