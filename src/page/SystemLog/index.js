import React from 'react';
import { Layout, Menu, Icon } from 'antd';
import createStore from '../createStore.js';
import { withRouter } from 'react-router'
import { netdata } from './../../helper'
import BroadTable from './broadTable'
import OpTable from './opTable'
import AlarmTable from './alarmTable'

const MenuItemGroup = Menu.ItemGroup;
const {  Content, Sider } = Layout;
const SystemLog= withRouter( class SystemLog extends React.Component {
  constructor(props) {
    super(props);
    // 初始化 store
    this.store = createStore({
        broadTabledatasource: [],
        opTableDataSource:[],
        AlarmTabledatasource:[],
        searchvalue:[],
        searchOpValue:[],
        searchAlarmValue:[],
        phonenum:"",
      });
  }
  state = {
    searchv:[],
    searchov:[],
    searcalarm:[],
    menukey:"1",
    logmenuKey:"1"
  };

  getbroadTable(num,start,end) {
    var that = this;
    let r = {
      method: "POST",
      body: JSON.stringify({ "opt": "QueryBroadcastLog","sj1":start,"sj2":end ,"phonenum":num})
    }
    netdata('/QueryHisLog.epy', r).then(
      that.onbroadtable.bind(that)
    )
  }

  getopTable(start,end) {
      var that = this;
      let r = {
          method: "POST",
          body: JSON.stringify({"opt": "QueryOptLog", "sj1": start, "sj2": end})
      }
      netdata('/QueryHisLog.epy', r).then(
          that.onoptable.bind(that)
      )
  }
  getAlarmTable(start,end,DevIds,alarmtype) {
    var that = this;
    let r = {
        method: "POST",
        body: JSON.stringify({"opt":"QueryHis","sj1":start,"sj2":end,"DevIds":DevIds,"AlarmTypes":alarmtype})
    }
    netdata('/AlarmOpt.epy', r).then(
        that.onalarmtable.bind(that)
    )
}
  onoptable(res) {
      if (res.d.errCode === "Cookie过期") {
          this.props.history.replace('/power')
      }
      let arr = ["opTime", "operator", "operate", "Details"];
      let data = res.d.Values;
      let Sdata = [];
      if (res.d.errCode == 0) {
          for (let j = 0; j < data.length; j++) {
              let dataitem = {};
              for (let i = 0; i < data[j].length; i++) {
                  dataitem[arr[i]] = data[j][i];
              }
              Sdata.push(dataitem);
          }
          this.store.setState({opTableDataSource: Sdata});
      }
  }


  onbroadtable(res) {
    if(res.d.errCode === "Cookie过期"){
      this.props.history.replace('/power')
    }
    let arr =["StartTime","EndTime","PhoneNum","Name","Source","Region","Details","Mode","Play"];
    let data =res.d.Values;
    let Sdata=[];
    if (res.d.errCode == 0) {
        for(let j =0;j<data.length;j++){
          let dataitem={};
          for(let i =0;i<data[j].length;i++){
            dataitem[arr[i]]=data[j][i];
          }
          Sdata.push(dataitem);
      }
      this.store.setState({ broadTabledatasource:Sdata});
    }
    else {

    }
  }
  onalarmtable(res) {
    if(res.d.errCode === "Cookie过期"){
      this.props.history.replace('/power')
    }
    let arr =["index","devicetype","name","logic","alarmtype","time"];
    let data =res.d.Values;
    let Sdata=[];
    if (res.d.errCode == 0) {
        for(let j =0;j<data.length;j++){
          let dataitem={};
          for(let i =0;i<data[j].length;i++){
            dataitem[arr[i]]=data[j][i];
          }
          Sdata.push(dataitem);
      }
      this.store.setState({ AlarmTabledatasource:Sdata});
    }
    else {

    }
  }

  handleClick(item){
        this.setState({menukey:item["key"]});
        localStorage.logmenuKey=item["key"];
        var myDate = new Date();
        var month= myDate.getMonth()+1;
        var day= myDate.getDate();
        var year =myDate.getFullYear();
        var time= year+"-"+month+"-"+day;

        if(this.state.menukey=="2")
        {
            this.getopTable(time.toString(),time.toString());
        }
        else if(this.state.menukey=="1"){
            this.getbroadTable("", time.toString(), time.toString());
        }
        else if(this.state.menukey=="3"){
          this.getAlarmTable(time.toString(), time.toString(),"-1","1");
      }
  }
  componentWillMount(){
    let logmenuKey= localStorage.logmenuKey
    this.setState({logmenuKey:logmenuKey,menukey:logmenuKey})
  }


  componentDidMount() {
    let that =this;
    var myDate = new Date();
   var month= myDate.getMonth()+1;
   var day= myDate.getDate();
   var year =myDate.getFullYear();
   var time= year+"-"+month+"-"+day;
    this.getbroadTable("",time.toString(),time.toString());
    this.getopTable(time.toString(),time.toString());
    this.getAlarmTable(time.toString(),time.toString(),"-1","1,2");
    this.store.subscribe(() => {
        const { searchvalue,phonenum,searchOpValue,searchAlarmValue } = this.store.getState();
        if (searchvalue !== this.state.searchv) {
          if(searchvalue.length!==0){
           this.setState({ searchv:searchvalue });
            that.getbroadTable(phonenum,searchvalue[0],searchvalue[1]);
          }
 
          }

          if(searchOpValue !== this.state.searchov)
          {
            if(searchOpValue.length!==0){
              this.setState({searchov:searchOpValue});
              that.getopTable(searchOpValue[0],searchOpValue[1]);
            }
          }
          if(searchAlarmValue !== this.state.searcalarm)
            {
              if(searchAlarmValue.length!==0){
                this.setState({searcalarm:searchAlarmValue});
                that.getAlarmTable(searchAlarmValue[0],searchAlarmValue[1],searchAlarmValue[2],searchAlarmValue[3]);
              }
            }
      });
  }
  renderContent(dd){
    switch (dd) {
      case "1":
        return <BroadTable store={this.store}/>;
        break;
      case "2":
        return <OpTable store={this.store}/>;
        break;
      case "3":
        return <AlarmTable store={this.store}/>;
        break;
        default:
        break;
    }
  }
  render() {
    return (
      <section id="myebody" className="e-body" style={{ height: window.innerHeight }}>
        <div className="my-content">
        <Layout>
      <Sider width={200}  style={{height:window.innerHeight-64, background: '#fff',boxShadow: "1px 0px 6px #dcd0d0" , overflow: 'auto', height: '100vh', position: 'fixed', left: 0}}>
      <Menu
      onClick={this.handleClick.bind(this)}
      style={{ height: '100%', borderRight: 0 }}
      defaultSelectedKeys={[this.state.logmenuKey]}
      mode="inline"
      theme="dark"
    >
        <MenuItemGroup key="g1" title="系统日志" >
          <Menu.Item key="1"  style={{fontSize:"14px" }} ><Icon type="file-text" />广播日志</Menu.Item>
          <Menu.Item key="2"  style={{fontSize:"14px" }}><Icon type="hdd" />操作日志</Menu.Item>
          <Menu.Item key="3"  style={{fontSize:"14px" }}><Icon type="exception" />告警日志</Menu.Item>
        </MenuItemGroup>
    </Menu>
      </Sider>
      <Layout style={{ marginLeft: 200 }}>
        <Content style={{ background: '#fff', margin: 0, minHeight: 280}}>
            {this.renderContent(this.state.menukey)}        
        </Content>
      </Layout>
    </Layout>    
    
      <style>{`
        .ant-menu-dark{
          background: rgb(48, 69, 88);
        }
        
   `}
          </style>
        </div>      
      </section>

    )
  }

}
)
export default SystemLog;