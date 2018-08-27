import React from 'react';
import { Layout,Row,Col, Menu, Icon ,Tabs,Progress,DatePicker,Select} from 'antd';
import { Chart, Geom, Axis, Tooltip, Legend, Coord, Label ,Guide,Shape,View} from 'bizcharts';
import { View as iView } from '@antv/data-set';
import createStore from '../createStore';
import { withRouter } from 'react-router'
import { netdata } from './../../helper'
import moment from 'moment';
const { Html } = Guide;
const { MonthPicker, RangePicker } = DatePicker;
const Option = Select.Option;
const dv = new iView();
const { TabPane } = Tabs;
let treeDataDic= [];
let devices=[];
const scaleC = {
  x: {
      alias: '区域' ,
      formatter: (val) => { return "第"+ val+"次"}, 
  },
  y: {
      alias: '覆盖率' ,
      formatter: (val) => { return val+"%"}, 
  },
  y1: {
    alias: '到达时效' ,
    formatter: (val) => { return val+"ms"}, 
}
}
const DisplayBoard=  withRouter(class DisplayBoard extends React.Component {
  constructor(props) {
    super(props);
    // 初始化 store
    this.store = createStore({
      });
  }
  state = {
    cdata:[],
    mode:"interval",
    sj:[],
    bardata:{
      total:0,
      totalnum:0,
      onlinenum:0,
      offlinenum:0,
      yz:0,
      bkj:0,
      wg:0,
      yy:0,
      szbm:0
  },
  bardatacover:{
    total:0,
    totalnum:0,
    onlinenum:0,
    offlinenum:0,
}
  };
  
  getcoverdata(sj1,sj2){
      let r = {
      method: "POST",
      body: JSON.stringify({"opt":"QueryCoverRate", "sj1":sj1,"sj2":sj2})
    };
    netdata("/QueryHisLog.epy", r).then(this.ondatacover.bind(this));
  }
  ondatacover(res) {
    if (res.d.errCode == 0) {
      let data =res.d.Values;
      console.log(data)
      let cdata=[]   
if(data.length!=0){               let bardatacover=this.state.bardatacover;
            bardatacover.total=data[0][4]
            bardatacover.totalnum=data[0][3]
            bardatacover.onlinenum=data[0][2]
            bardatacover.offlinenum=data[0][3]-data[0][2]
            this.setState({bardatacover:bardatacover})
      for(let i=data.length-1;i>0;i--){
        // if(i==0){  console.log(data[i])

        // }
      
        cdata.push({x:i+1,y:data[i][4],y1:data[i][5]})
      }
      this.setState({cdata:cdata})}
    } else {
    }
  }
  componentDidMount(){
    let r = {
      method: "POST",
      body: JSON.stringify({ opt: "getTree" })
    };
    netdata("/topoly/regionTreeOpt.epy", r).then(this.ondata.bind(this));
    var myDate = new Date();
    var month= myDate.getMonth()+1;
    var day= myDate.getDate();
    var year =myDate.getFullYear();
    var time= year+"-"+month+"-"+day;
    this.getcoverdata(time.toString()+" 00:00:01",time.toString()+" 23:59:59")
  }; 
  ondata(res) {
    if (res.d.errCode == 0) {
      this.getTreeDic(res.d.Values);
      let devicesList=  this.initdevicedata(treeDataDic["-1"]);
      // const { store } = this.props;
      // store.setState({ regionname: "路通应急广播管理系统",devicesList:devicesList});


      this.inidata(devicesList);

    } else {
    }
  }
  renderdeviceTable(dev){
    let devdata=[];
    for(let i in dev){

        dev[i].forEach(function(i,index){
            let indata={}

            for(let j in i){
                         if(j!="children"){
                        indata[j]=i[j]
                    }
            } 
            devdata.push(indata)

        })
    }
    return devdata;
}
  inidata(devicesList){
    let deviceTabledata = this.renderdeviceTable(devicesList);
    let total =deviceTabledata.length;
    let online=0;
    let yzon=0,yzoff=0;
    let wgon=0,wgoff=0;
    let bkjon=0,bkjoff=0;
    let yyon=0,yyoff=0;
    let szbmon=0,szbmoff=0;
     for(var dd in deviceTabledata){

         if(deviceTabledata[dd].state===0){
             online++; 
            switch (deviceTabledata[dd].DevType) {
             case "1":
                 yzon++;
                 break;
             case "2":
                yyon++;
                 break;
             case "3":
                 wgon++;
                 break;
             case "4":
                 szbmon++;
                 break;
             case "5":
             bkjon++;
                 break;
             default:
                 break;
         }
        }else{
         switch (deviceTabledata[dd].DevType) {
             case "1":
                 yzoff++;
                 break;
            case "2":
                 yyoff++;
                 break;
             case "3":
                  wgoff++;
                 break;
             case "4":
                 szbmoff++;
                break;
             case "5":
             bkjoff++;
                 break;
             default:
                 break;
         }
        }
     }
    let bardata =this.state.bardata;
    bardata.totalnum=total;
    bardata.offlinenum=total-online;
    bardata.onlinenum =online;
    bardata.total =parseInt(online/total*100);
    if((yzon+yzoff)!==0)
    {bardata.yz=parseInt(yzon/(yzon+yzoff)*100);}
    if((wgon+wgoff)!==0)
    {bardata.wg=parseInt(wgon/(wgon+wgoff)*100);}
    if((bkjon+bkjoff)!==0)
    {bardata.bkj=parseInt(bkjon/(bkjon+bkjoff)*100);}
    if((yyon+yyoff)!==0)
      {bardata.yy=parseInt(yyon/(yyon+yyoff)*100);}
    if((szbmon+szbmoff)!==0)
      {bardata.szbm=parseInt(szbmon/(szbmon+szbmoff)*100);}
     this.setState({bardata:bardata});
  }


  getDevice(data) {
    data.children.map(item => {
      if (item.eocT !== -1 && item.eocT !== 0) {
        devices.push(item);
      } else {
        this.getDevice(item);
      }
    });
  }
  getTreeDic = data => {
    return data.map(item => {
      devices = [];
      this.getDevice(item);
      treeDataDic[item.id] = devices;
      if (item.children.length != 0) {
        this.getTreeDic(item.children);
      }
    });
  };
  
  initdevicedata(ddata){
    let devicesList={}
    let no1=[],no2=[],no3=[],no4=[],no5=[];
    ddata.map(item=>{
      
      switch (item.DevType) {
        case '1':
        no1.push(item);
          break;
        case "2":
        no2.push(item);
          break;
        case "3":
        no3.push(item);
            break;
        case "4":
        no4.push(item);
            break;
        case "5":
        no5.push(item);
            break;
        default:
          break;
      }
    })
    devicesList['dev1']=no1;devicesList['dev2']=no2;devicesList['dev3']=no3;devicesList['dev4']=no4;devicesList['dev5']=no5;
    return devicesList;
  }
  handleTabChange = (key) => {
    // this.setState({
    //   currentTabKey: key,
    // });
  }
  timeonChange(date, dateString) {
    console.log(date, dateString);
    this.getcoverdata(dateString[0]+" 00:00:01",dateString[1]+" 23:59:59")
  }
  rowlinehandleChange(value) {
    this.setState({mode:value})
  }

  render1(mode){
    switch (mode) {
      case "line":
      return(<Chart width={window.innerWidth-200} height={350} data={this.state.cdata} scale={scaleC}>
        <Axis name="x" />
        <Axis name="y"/>
        {/* <Axis name="y1" grid={null}/> */}
        <Legend position="bottom" dy={-20} />
        <Tooltip /> 
          <Geom type="line" color="#15e6b7" position="x*y" hape="smooth"/>
          {/* <Geom type="line" position="x*y1" color="#fdae6b" size={3} shape="smooth" />
           <Geom type="point" position="x*y1" color="#fdae6b" size={3} shape="circle" /> */}
           <Geom type="point" position="x*y" color="#15e6b7" size={3} shape="circle" />
     
      </Chart>)
        
        break;
        case "interval":
        return(        <Chart width={window.innerWidth-200} height={350} data={this.state.cdata} scale={scaleC}>
        <Axis name="x" />
        <Axis name="y"/>
        {/* <Axis name="y1" grid={null}/> */}
        <Legend position="bottom" dy={-20} />
        <Tooltip /> 
          <Geom type="interval" color="rgb(136, 132, 216)" position="x*y" />
          {/* <Geom type="line" position="x*y1" color="#fdae6b" size={3} shape="smooth" />
           <Geom type="point" position="x*y1" color="#fdae6b" size={3} shape="circle" /> */}
     
      </Chart>)
          
          break;
          case "all":
          return(        <Chart width={window.innerWidth-200} height={350} data={this.state.cdata} scale={scaleC}>
          <Axis name="x" />
          <Axis name="y" />
          {/* <Axis name="y1" grid={null}/> */}
          <Legend position="bottom" dy={-20} />
          <Tooltip /> 
            <Geom type="interval" color="rgb(136, 132, 216)" position="x*y" />
          <Geom type="line" color="#15e6b7" position="x*y" shape="smooth" />
           <Geom type="point" position="x*y" color="#15e6b7" size={3} shape="circle" />
       
        </Chart>)
            
            break;
      default:
        break;
    }
  }
  render2(mode){
    switch (mode) {
      case "line":
      return(<Chart width={window.innerWidth-200} height={350} data={this.state.cdata} scale={scaleC}>
        <Axis name="x" />
        <Axis name="y1"/>
        {/* <Axis name="y1" grid={null}/> */}
        <Legend position="bottom" dy={-20} />
        <Tooltip /> 
          <Geom type="line" color="#15e6b7" position="x*y1" shape="smooth" />
           <Geom type="point" position="x*y1" color="#15e6b7" size={3} shape="circle" />
     
      </Chart>)
        
        break;
        case "interval":
        return(        <Chart width={window.innerWidth-200} height={350} data={this.state.cdata} scale={scaleC}>
        <Axis name="x" />
        <Axis name="y1"/>
        {/* <Axis name="y1" grid={null}/> */}
        <Legend position="bottom" dy={-20} />
        <Tooltip /> 
          <Geom type="interval" color="rgb(136, 132, 216)" position="x*y1" />
          {/* <Geom type="line" position="x*y1" color="#fdae6b" size={3} shape="smooth" />
           <Geom type="point" position="x*y1" color="#fdae6b" size={3} shape="circle" /> */}
     
      </Chart>)
          
          break;
          case "all":
          return(        <Chart width={window.innerWidth-200} height={350} data={this.state.cdata} scale={scaleC}>
          <Axis name="x" />
          <Axis name="y1"/>
          {/* <Axis name="y1" grid={null}/> */}
          <Legend position="bottom" dy={-20} />
          <Tooltip /> 
            <Geom type="interval" color="rgb(136, 132, 216)" position="x*y1" />
      <Geom type="line" color="#15e6b7" position="x*y1" shape="smooth" />
           <Geom type="point" position="x*y1" color="#15e6b7" size={3} shape="circle" />
       
        </Chart>)
            
            break;

      default:
        break;
    }
  }
  render() {
    // 数据源
const data = [
  { genre: 'Sports', sold: 275, income: 2300 },
  { genre: 'Strategy', sold: 115, income: 667 },
  { genre: 'Action', sold: 120, income: 982 },
  { genre: 'Shooter', sold: 350, income: 5271 },
  { genre: 'Other', sold: 150, income: 3710 },
  { genre: 'Sports1', sold: 275, income: 2300 },
  { genre: 'Strategy1', sold: 115, income: 667 },
  { genre: 'Action1', sold: 120, income: 982 },
  { genre: 'Shooter1', sold: 350, income: 5271 },
  { genre: 'Other1', sold: 150, income: 3710 }

];
const data1 = [
  { time: '2015-01-01 1:00', acc: 84.0 },
  { time: '2015-01-01 2:00', acc: 14.0 },
  { time: '2015-01-01 3:00', acc: 34.0 },
  { time: '2015-01-01 4:00', acc: 24.0 },
  { time: '2015-01-01 5:00', acc: 4.0 },
  { time: '2015-01-01 6:00', acc: 14.0 },
  { time: '2015-01-01 7:00', acc: 84.0 },
  { time: '2015-01-01 8:00', acc: 14.0 },
  { time: '2015-01-01 9:00', acc: 34.0 },
  { time: '2015-01-01 10:00', acc: 24.0 },
  { time: '2015-01-01 11:00', acc: 4.0 },
  { time: '2015-01-01 12:00', acc: 14.0 },
  { time: '2015-01-01 13:00', acc: 84.0 },
  { time: '2015-01-01 14:00', acc: 14.0 },
  { time: '2015-01-01 15:00', acc: 34.0 },
  { time: '2015-01-01 16:00', acc: 24.0 },
  { time: '2015-01-01 17:00', acc: 4.0 },
  { time: '2015-01-01 18:00', acc: 14.0 },
  { time: '2015-01-01 19:00', acc: 84.0 },
  { time: '2015-01-01 20:00', acc: 14.0 },
  { time: '2015-01-01 21:00', acc: 34.0 },
  { time: '2015-01-01 22:00', acc: 24.0 },
  { time: '2015-01-01 23:00', acc: 4.0 },
  { time: '2015-01-01 24:00', acc: 14.0 },
];

const cols = {
  time: {type:"time", mask: 'YYYY-MM-dd HH:mm ' },
  acc: { alias: '在线率' }
};

const data11 = [
  { time: 1246406400000, temperature: [ 14.3, 27.7 ] },
  { time: 1246492800000, temperature: [ 14.5, 27.8 ] },
  { time: 1246579200000, temperature: [ 15.5, 29.6 ] },
  { time: 1246665600000, temperature: [ 16.7, 30.7 ] },
  { time: 1246752000000, temperature: [ 16.5, 25.0 ] },
  { time: 1246838400000, temperature: [ 17.8, 25.7 ] },
  { time: 1246924800000, temperature: [ 13.5, 24.8 ] },
  { time: 1247011200000, temperature: [ 10.5, 21.4 ] },
  { time: 1247097600000, temperature: [ 9.2, 23.8 ] },
  { time: 1247184000000, temperature: [ 11.6, 21.8 ] },
  { time: 1247270400000, temperature: [ 10.7, 23.7 ] },
  { time: 1247356800000, temperature: [ 11.0, 23.3 ] },
  { time: 1247443200000, temperature: [ 11.6, 23.7 ] },
  { time: 1247529600000, temperature: [ 11.8, 20.7 ] },
  { time: 1247616000000, temperature: [ 12.6, 22.4 ] },
  { time: 1247702400000, temperature: [ 13.6, 19.6 ]  },
  { time: 1247788800000, temperature: [ 11.4, 22.6 ] },
  { time: 1247875200000, temperature: [ 13.2, 25.0 ] },
  { time: 1247961600000, temperature: [ 14.2, 21.6 ] },
  { time: 1248048000000, temperature: [ 13.1, 17.1 ] },
  { time: 1248134400000, temperature: [ 12.2, 15.5 ] },
  { time: 1248220800000, temperature: [ 12.0, 20.8 ] },
  { time: 1248307200000, temperature: [ 12.0, 17.1 ] },
  { time: 1248393600000, temperature: [ 12.7, 18.3 ] },
  { time: 1248480000000, temperature: [ 12.4, 19.4 ] },
  { time: 1248566400000, temperature: [ 12.6, 19.9 ] },
  { time: 1248652800000, temperature: [ 11.9, 20.2 ] },
  { time: 1248739200000, temperature: [ 11.0, 19.3 ] },
  { time: 1248825600000, temperature: [ 10.8, 17.8 ] },
  { time: 1248912000000, temperature: [ 11.8, 18.5 ] },
  { time: 1248998400000, temperature: [ 10.8, 16.1 ] }
];

const averages = [
  { time: 1246406400000, temperature: 21.5 },
  { time: 1246492800000, temperature: 22.1 },
  { time: 1246579200000, temperature: 23 },
  { time: 1246665600000, temperature: 23.8 },
  { time: 1246752000000, temperature: 21.4 },
  { time: 1246838400000, temperature: 21.3 },
  { time: 1246924800000, temperature: 18.3 },
  { time: 1247011200000, temperature: 15.4 },
  { time: 1247097600000, temperature: 16.4 },
  { time: 1247184000000, temperature: 17.7 },
  { time: 1247270400000, temperature: 17.5 },
  { time: 1247356800000, temperature: 17.6 },
  { time: 1247443200000, temperature: 17.7 },
  { time: 1247529600000, temperature: 16.8 },
  { time: 1247616000000, temperature: 17.7 },
  { time: 1247702400000, temperature: 16.3  },
  { time: 1247788800000, temperature: 17.8 },
  { time: 1247875200000, temperature: 18.1 },
  { time: 1247961600000, temperature: 17.2 },
  { time: 1248048000000, temperature: 14.4 },
  { time: 1248134400000, temperature: 13.7 },
  { time: 1248220800000, temperature: 15.7 },
  { time: 1248307200000, temperature: 14.6 },
  { time: 1248393600000, temperature: 15.3 },
  { time: 1248480000000, temperature: 15.3 },
  { time: 1248566400000, temperature: 15.8 },
  { time: 1248652800000, temperature: 15.2 },
  { time: 1248739200000, temperature: 14.8 },
  { time: 1248825600000, temperature: 14.4 },
  { time: 1248912000000, temperature: 15 },
  { time: 1248998400000, temperature: 13.6 }
];
const cols1 = {
  temperature: {
    sync: true
  },
  time: {
    type: 'time',
    mask: 'MM-DD',
    tickInterval: 24 * 3600 * 1000 * 2
  }
}
const data2 = [
  { item: '锡山区', count: 40 },
  { item: '惠山区', count: 21 },
  { item: '滨湖区', count: 17 },
  { item: '其他', count: 13 },
  { item: '新区', count: 9 }
  ];
  const dv = new iView();
  dv.source(data2).transform({
  type: 'percent',
  field: 'count',
  dimension: 'item',
  as: 'percent'
  });
  const cols2 = {
  percent: {
    formatter: val => {
      val = (val * 100) + '%';
      return val;
    }
  }
  }   


const CustomTab = ({num, data, currentTabKey: currentKey }) => (
  
  <Row gutter={8} style={{ width: 138, margin: '8px 0' }}>
    <Col span={12}>
          <div className="numberInfo numberInfolight">
          <div className="numberInfoTitle">
            {data}
          </div>
          <div className="numberInfoSubTitle">
            在线率
          </div>
          <div className="numberInfoValue" style={{marginTop: "2px"}}>
            <span>
              {num}%
            </span>
          </div>
        </div>
    </Col>
    <Col span={12} style={{ paddingTop: 36 }}>
    <Progress type="circle" percent={num} width={67} format={percent => (<div className="valnum">{percent}%</div>)}/>
    </Col>
  </Row>
);
    return <section id="myebody" className="e-body" style={{ height: window.innerHeight }}>
        <div className="my-content" style={{ backgroundColor: "#2f4659",    paddingBottom: "29px"}}>
          <div className="boardcontent">
          <div className="boarditem11">
              <div className="itemTitle">下发任务覆盖率</div>
              <div className="boardItem1Item">
                <div className="boardItem1ItemContent">
                  <div className="rTopItem1Extra">
                    <div className="rTopItem2Extra1Path" />
                  </div>
                  <div className="itemSmTitle">实时覆盖率</div>
                  <div className="val">
                    {this.state.bardatacover.total}
                    <span className="unit">%</span>
                  </div>
                </div>
              </div>
              <div className="boardItem1Item">
                <div className="boardItem1ItemContent">
                  <div className="rTopItem2Extra" />
                  <div className="itemSmTitle">目标设备</div>
                  <div className="val">
                  {this.state.bardatacover.totalnum}
                    <span className="unit">个</span>
                  </div>
                </div>
              </div>
              <div className="boardItem1Item">
                <div className="boardItem1ItemContent">
                  <div className="rTopItem3Extra" />
                  <div className="itemSmTitle">响应设备</div>
                  <div className="val">
                  {this.state.bardatacover.onlinenum}
                    <span className="unit">个</span>
                  </div>
                </div>
              </div>
              <div className="boardItem1Item">
                <div className="boardItem1ItemContent">
                  <div className="rTopItem4Extra" />
                  <div className="itemSmTitle">未响应设备</div>
                  <div className="val">
                  {this.state.bardatacover.offlinenum}
                    <span className="unit">个</span>
                  </div>
                </div>
              </div>
              <div style={{marginLeft: "115px"}}>
              <RangePicker allowClear={false} defaultValue={[moment(Date.now()), moment(Date.now())]} onChange={this.timeonChange.bind(this)}  style={{marginRight:"12px"}}/>
              <Select defaultValue="interval" style={{ width: 120 }} onChange={this.rowlinehandleChange.bind(this)}>
              <Option value="interval"> 柱状图</Option>
              <Option value="line">折线图</Option>
              <Option value="all">折线图+柱状图</Option>
            </Select>
              </div>
              <div style={{ padding: "0 24px" , textAlign: "center"}}>
                <div style={{color: "#bad8f1",    fontSize: "17px"}}>按次覆盖率统计曲线</div>
                    {this.render1(this.state.mode)}
                <div style={{color: "#bad8f1",    fontSize: "17px"}}>按次到达时效统计曲线</div>
                    {this.render2(this.state.mode)}
                  </div>
            </div>






            <div className="boarditem1">
              <div className="itemTitle">设备在线率</div>
              <div className="boardItem1Item">
                <div className="boardItem1ItemContent">
                  <div className="rTopItem1Extra">
                    <div className="rTopItem2Extra1Path" />
                  </div>
                  <div className="itemSmTitle">实时在线率</div>
                  <div className="val">
                    {this.state.bardata.total}
                    <span className="unit">%</span>
                  </div>
                </div>
              </div>
              <div className="boardItem1Item">
                <div className="boardItem1ItemContent">
                  <div className="rTopItem2Extra" />
                  <div className="itemSmTitle">设备总数</div>
                  <div className="val">
                  {this.state.bardata.totalnum}
                    <span className="unit">个</span>
                  </div>
                </div>
              </div>
              <div className="boardItem1Item">
                <div className="boardItem1ItemContent">
                  <div className="rTopItem3Extra" />
                  <div className="itemSmTitle">在线设备</div>
                  <div className="val">
                  {this.state.bardata.onlinenum}
                    <span className="unit">个</span>
                  </div>
                </div>
              </div>
              <div className="boardItem1Item">
                <div className="boardItem1ItemContent">
                  <div className="rTopItem4Extra" />
                  <div className="itemSmTitle">离线设备</div>
                  <div className="val">
                  {this.state.bardata.offlinenum}
                    <span className="unit">个</span>
                  </div>
                </div>
              </div>
            </div>




            {/* <div className="boarditem2">
              <Tabs onChange={this.handleTabChange}>
                <TabPane tab={<CustomTab num={this.state.bardata.yz} data={"音柱"} currentTabKey={1} />} key="1">
                  <div style={{ padding: "0 54px" }}>
                    <div className="title">
                      一天的设备在线曲线
                      <span className="subTitle">
                        (2018-04-21 0：00 ~ 2018-04-21 24：00)
                      </span>
                    </div>
                    <Chart height={350} scale={cols1} forceFit >
                    <Tooltip crosshairs={{type:'line'}}/>
                    <View data={data11} >
                      <Axis name="time" />
                      <Axis name="temperature" />
                      <Geom type="area" position="time*temperature" tooltip={false}/>
                    </View>
                    <View data={averages} >
                      <Geom  tooltip={['time*temperature', (time, temperature) => {
	  return {
		name: '在线率',
		value: temperature
	  };
	}]}
                       type="line" position="time*temperature" size={2} />
                      <Geom     tooltip={['time*temperature', (time, temperature) => {
	  return {
		name: '在线率',
		value: temperature
	  };
	}]} type="point" position="time*temperature" size={4} shape='circle' style={{stroke: '#fff',lineWidth: 1,fillOpacity: 1}}/>
                    </View>
                  </Chart>
                  </div>
                </TabPane>
                <TabPane tab={<CustomTab num={this.state.bardata.yy} data={"语音控制器"} currentTabKey={2} />} key="2">
                  <div style={{ padding: "0 24px" }}>
                    <Chart width={600} height={350} data={data}>
                      <Axis name="genre" />
                      <Axis name="sold" />
                      <Legend position="bottom" dy={-20} />
                      <Tooltip />
                      <Geom type="line" position="genre*sold" size={2} />
                      <Geom type="interval" position="genre*sold" />
                    </Chart>
                  </div>
                </TabPane>
                <TabPane tab={<CustomTab num={this.state.bardata.wg} data={"短信网关"} currentTabKey={3} />} key="3">
                  <div style={{ padding: "0 24px" }}>
                    <Chart width={600} height={350} data={data}>
                      <Axis name="genre" />
                      <Axis name="sold" />
                      <Legend position="bottom" dy={-20} />
                      <Tooltip />
                      <Geom type="line" position="genre*sold" size={2} />
                      <Geom type="interval" position="genre*sold" />
                    </Chart>
                  </div>
                </TabPane>
                <TabPane tab={<CustomTab num={this.state.bardata.szbm} data={"编码控制器"} currentTabKey={4} />} key="4">
                  <div style={{ padding: "0 24px" }}>
                    <Chart width={600} height={350} data={data}>
                      <Axis name="genre" />
                      <Axis name="sold" />
                      <Legend position="bottom" dy={-20} />
                      <Tooltip />
                      <Geom type="line" position="genre*sold" size={2} />
                      <Geom type="interval" position="genre*sold" />
                    </Chart>
                  </div>
                </TabPane>
                <TabPane tab={<CustomTab num={this.state.bardata.bkj}  data={"播控机"} currentTabKey={5} />} key="5">
                  <div style={{ padding: "0 24px" }}>
                    <Chart width={600} height={350} data={data}>
                      <Axis name="genre" />
                      <Axis name="sold" />
                      <Legend position="bottom" dy={-20} />
                      <Tooltip />
                      <Geom type="line" position="genre*sold" size={2} />
                      <Geom type="interval" position="genre*sold" />
                    </Chart>
                  </div>
                </TabPane>
              </Tabs>
            </div>
            <div className="boarditem3">
              <div className="itemTitle">统计</div>
              <div className="rightC" >
              <Row gutter={16}>
                  <Col className="gutter-row" span={12}>
                  <div className="title">下发任务覆盖率排名</div>
                      <div className="listItem">
                        <div className="index" style={{backgroundColor: "rgb(240, 72, 100)"}}>
                          1
                        </div>
                        <div title="滨湖区" className="name">
                        滨湖区
                        </div>
                        <div className="val">
                          90%
                        </div>
                      </div>
                      <div className="listItem">
                        <div className="index" style={{backgroundColor: "rgb(200, 71, 96)"}}>
                          2
                        </div>
                        <div title="惠山区" className="name">
                        惠山区
                        </div>
                        <div className="val">
                          81%
                        </div>
                      </div>
                      <div className="listItem">
                        <div className="index" style={{backgroundColor: "rgb(141, 68, 90)"}}>
                          3
                        </div>
                        <div title="锡山区" className="name">
                        锡山区
                        </div>
                        <div className="val">
                          76%
                        </div>
                      </div>
                      <div className="listItem">
                        <div className="index" >
                          4
                        </div>
                        <div title="新区" className="name">
                          新区
                        </div>
                        <div className="val">
                          75%
                        </div>
                      </div>
                      <div className="listItem">
                        <div className="index" >
                          5
                        </div>
                        <div title="梁溪区" className="name">
                        梁溪区
                        </div>
                        <div className="val">
                          70%
                        </div>
                      </div>
                  </Col>
                  <Col className="gutter-row" span={12}>
                  <div className="title">到达时效排名</div>
                      <div className="listItem">
                        <div className="index" style={{backgroundColor: "rgb(240, 72, 100)"}}>
                          1
                        </div>
                        <div title="滨湖区" className="name">
                        滨湖区
                        </div>
                        <div className="val">
                          90%
                        </div>
                      </div>
                      <div className="listItem">
                        <div className="index" style={{backgroundColor: "rgb(200, 71, 96)"}}>
                          2
                        </div>
                        <div title="惠山区" className="name">
                        惠山区
                        </div>
                        <div className="val">
                          81%
                        </div>
                      </div>
                      <div className="listItem">
                        <div className="index" style={{backgroundColor: "rgb(141, 68, 90)"}}>
                          3
                        </div>
                        <div title="锡山区" className="name">
                        锡山区
                        </div>
                        <div className="val">
                          76%
                        </div>
                      </div>
                      <div className="listItem">
                        <div className="index" >
                          4
                        </div>
                        <div title="新区" className="name">
                          新区
                        </div>
                        <div className="val">
                          75%
                        </div>
                      </div>
                      <div className="listItem">
                        <div className="index" >
                          5
                        </div>
                        <div title="梁溪区" className="name">
                        梁溪区
                        </div>
                        <div className="val">
                          70%
                        </div>
                      </div>
                  </Col>
              </Row>
              <Row gutter={16}>
                  <Col className="gutter-row" span={12}>
                  <div className="title">在线率排名</div>
                      <div className="listItem">
                        <div className="index" style={{backgroundColor: "rgb(240, 72, 100)"}}>
                          1
                        </div>
                        <div title="滨湖区" className="name">
                        滨湖区
                        </div>
                        <div className="val">
                          90%
                        </div>
                      </div>
                      <div className="listItem">
                        <div className="index" style={{backgroundColor: "rgb(200, 71, 96)"}}>
                          2
                        </div>
                        <div title="惠山区" className="name">
                        惠山区
                        </div>
                        <div className="val">
                          81%
                        </div>
                      </div>
                      <div className="listItem">
                        <div className="index" style={{backgroundColor: "rgb(141, 68, 90)"}}>
                          3
                        </div>
                        <div title="锡山区" className="name">
                        锡山区
                        </div>
                        <div className="val">
                          76%
                        </div>
                      </div>
                      <div className="listItem">
                        <div className="index" >
                          4
                        </div>
                        <div title="新区" className="name">
                          新区
                        </div>
                        <div className="val">
                          75%
                        </div>
                      </div>
                      <div className="listItem">
                        <div className="index" >
                          5
                        </div>
                        <div title="梁溪区" className="name">
                        梁溪区
                        </div>
                        <div className="val">
                          70%
                        </div>
                      </div>
                  </Col>
                  <Col className="gutter-row" span={12}>
                  <div className="title">到达时效排名</div>
                      <div className="listItem">
                        <div className="index" style={{backgroundColor: "rgb(240, 72, 100)"}}>
                          1
                        </div>
                        <div title="滨湖区" className="name">
                        滨湖区
                        </div>
                        <div className="val">
                          90%
                        </div>
                      </div>
                      <div className="listItem">
                        <div className="index" style={{backgroundColor: "rgb(200, 71, 96)"}}>
                          2
                        </div>
                        <div title="惠山区" className="name">
                        惠山区
                        </div>
                        <div className="val">
                          81%
                        </div>
                      </div>
                      <div className="listItem">
                        <div className="index" style={{backgroundColor: "rgb(141, 68, 90)"}}>
                          3
                        </div>
                        <div title="锡山区" className="name">
                        锡山区
                        </div>
                        <div className="val">
                          76%
                        </div>
                      </div>
                      <div className="listItem">
                        <div className="index" >
                          4
                        </div>
                        <div title="新区" className="name">
                          新区
                        </div>
                        <div className="val">
                          75%
                        </div>
                      </div>
                      <div className="listItem">
                        <div className="index" >
                          5
                        </div>
                        <div title="梁溪区" className="name">
                        梁溪区
                        </div>
                        <div className="val">
                          70%
                        </div>
                      </div>
                  </Col>
              </Row>

                </div>
              <div className="leftC">
                <div style={{ width: "100%", position: "relative" }}>
                  <Chart height={280} data={dv} scale={cols} padding={[0, 0, 0, 0]} forceFit>
                    <Coord type={"theta"} radius={0.75} innerRadius={0.6} />
                    <Axis name="percent" />
                  
                    <Tooltip showTitle={false} itemTpl="<li><span style=&quot;background-color:{color};&quot; class=&quot;g2-tooltip-marker&quot;></span>{name}: {value}</li>" />
                    <Guide>
                      <Html position={["50%", "50%"]} html="<div style=&quot;color:#8c8c8c;font-size:1.16em;text-align: center;width: 10em;&quot;>广播下发<br><span style=&quot;color:#262626;font-size:2.5em&quot;>200</span>次</div>" alignX="middle" alignY="middle" />
                    </Guide>
                    <Geom type="intervalStack" position="percent" color="item" tooltip={["item*percent", (item, percent) => {
                          percent = percent * 100 + "%";
                          return { name: item, value: percent };
                        }]} style={{ lineWidth: 0, stroke: "#fff" }}>
                    </Geom>
                  </Chart>
                </div>
                <div style={{ width: "100%", margin: "auto" }}>
                          <div className="orderLend">
                            <div className="leftContent">
                              <div title="滨湖区" className="leftCName">
                                <span className="lend" style={{ backgroundColor: "rgb(46, 174, 89)" }} />
                                滨湖区
                              </div>
                              <div className="rightCVal">21 次</div>
                            </div>
                            <div className="rightContent">17 %</div>
                          </div>
                          <div className="orderLend">
                            <div className="leftContent">
                              <div title="惠山区" className="leftCName">
                                <span className="lend" style={{ backgroundColor: "rgb(26, 132, 229)" }} />
                                惠山区
                              </div>
                              <div className="rightCVal">53 次</div>
                            </div>
                            <div className="rightContent">21 %</div>
                          </div>
                          <div className="orderLend">
                            <div className="leftContent">
                              <div title="锡山区" className="leftCName">
                                <span className="lend" style={{ backgroundColor: "rgb(22, 174, 177)" }} />
                                锡山区
                              </div>
                              <div className="rightCVal">139 次</div>
                            </div>
                            <div className="rightContent">40 %</div>
                          </div>
                          <div className="orderLend">
                            <div className="leftContent">
                              <div title="新区" className="leftCName">
                                <span className="lend" style={{ backgroundColor: "rgb(210, 70, 97)" }} />
                                新区
                              </div>
                              <div className="rightCVal">21 次</div>
                            </div>
                            <div className="rightContent">13 %</div>
                          </div>
                          <div className="orderLend">
                            <div className="leftContent">
                              <div title="其他" className="leftCName">
                                <span className="lend" style={{ backgroundColor: "rgb(219, 183, 29)" }} />
                                其他
                              </div>
                              <div className="rightCVal">21 次</div>
                            </div>
                            <div className="rightContent">9 %</div>
                          </div>
                </div>
              </div>
            </div> */}
        
          </div>

          <style>
            {`
            .boarditem3  .listItem {
    line-height: 40px;
    height: 40px;
    border-bottom: 1px dashed #3b5265;
    color: white;
    position: relative;
}
.boarditem3 .listItem .index{
    width: 20px;
    height: 20px;
    border-radius: 50%;
    line-height: 20px;
    margin: 9px 20px 0 8px;
    float: left;
    text-align: center;
}
.boarditem3 .listItem .name{
    font-size: 14px;
    position: absolute;
    left: 40px;
    right: 98px;
    overflow: hidden;
    white-space: nowrap;
    vertical-align: bottom;
    text-overflow: ellipsis;
}
.boarditem3 .listItem .val {
    margin-right: 18px;
    float: right;
    font-size: 14px;
    width: 80px;
    text-align: right;
}
            .boarditem3 .gutter-row .title {
    height: 60px;
    line-height: 60px;
    border-bottom: 1px dashed #3b5265;
    font-size: 16px;
    color: #7ba0bb;
    text-align: center;
}
      .orderLend {
    width: 80%;
    margin: auto;
    line-height: 40px;
    height: 40px;
    position: relative;
}
.orderLend .leftContent {
    position: absolute;
    left: 0;
    right: 70px;
}

.orderLend .leftContent .leftCName{
    position: absolute;
    left: 0;
    right: 100px;
    overflow: hidden;
    white-space: nowrap;
    vertical-align: bottom;
    text-overflow: ellipsis;
}
.orderLend .lend{
    border-radius: 3px;
    margin-right: 5px;
    display: inline-block;
    height: 14px;
    width: 16px;
    vertical-align: -2px;
}
.orderLend .leftContent  .rightCVal {
    width: 100px;
    float: right;
    color: #fff;
    text-align: right;
}
.orderLend .rightContent {
    width: 70px;
    float: right;
    text-align: right;
    color:#4f92b8;
}
      .boarditem3 .leftC {
    width: 40%;
    padding: 20px 0 0 0;
    height: 580px;
}
.boarditem3 .rightC{
    position: absolute;
    top: 33px;
    bottom: 0;
    left: 45%;
    right: 50px;
}
      .rTopItem2Extra1Path{
        position: absolute;
        top: 28px;
        left: 1px;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background-color: #10e9b9;
        box-shadow: 0px 0px 12px 1px #10e9b9;
        opacity: 1;
        -webkit-animation: heartAM 2s;
        animation: heartAM 2s;
        -webkit-animation-timing-function: linear;
        animation-timing-function: linear;
        -webkit-animation-iteration-count: 10000000;
        animation-iteration-count: 10000000;
      }

      @keyframes heartAM {
  0% {
    top: 28px;
    left: 1px;
  }
  15% {
    top: 28px;
    left: 8px;
  }
  25% {
    top: 0px;
    left: 16px;
  }
  30% {
    top: 0px;
    left: 17px;
  }
  40% {
    top: 41px;
    left: 24px;
  }
  60% {
    top: 17px;
    left: 32px;
  }
  75% {
    top: 28px;
    left: 38px;
    opacity: 1;
  }
  100% {
    top: 28px;
    left: 44px;
    opacity: 0;
  }
}
    .boardcontent{
      max-width: 1600px;
    margin: auto;
    background-color: #2f4659;
    padding: 15px 15px 0;
    min-height: 100%;
    color: white;
    }    
    .boarditem2{
      border: 1px solid #3c5668;
    background-color: #2a3f50;
    border-radius: 5px;
    height: 540px;
    margin-bottom: 12px;
    }
    .boarditem3{
      border: 1px solid #3c5668;
    background-color: #2a3f50;
    border-radius: 5px;
    height: 590px;
    margin-bottom: 12px;
    position:relative;
    }
    .boarditem{
      border: 1px solid #3c5668;
    background-color: #2a3f50;
    border-radius: 5px;
    height: 210px;
    margin-bottom: 12px;
    }
    .boarditem1{
      border: 1px solid #3c5668;
    background-color: #2a3f50;
    border-radius: 5px;
    height: 210px;
    margin-bottom: 12px;
    }
    .boarditem11{
      border: 1px solid #3c5668;
    background-color: #2a3f50;
    border-radius: 5px;
    height: 910px;
    margin-bottom: 12px;
    }
    .boardItem1Item{
      width: 25%;
    height: 120px;
    float: left;
    position: relative;
    }
    .boardItem1ItemContent{
      padding-left: 100px;
    padding-top: 15px;
    position: absolute;
    left: 50%;
    -webkit-transform: translateX(-50%);
    -ms-transform: translateX(-50%);
    transform: translateX(-50%);
    width: -webkit-max-content;
    width: -moz-max-content;
    width: max-content;
    }
    .boardItem1ItemContent .itemSmTitle {
    line-height: 38px;
    color: #799eb8;
    font-size: 16px;
}
.boardItem1ItemContent .val {
    font-size: 30px;
    line-height: 1;
}
.valnum{
  color: #fff;
}
.boardItem1ItemContent .unit{
    margin-left: 8px;
    font-size: 12px;
    color: #789eb8;
}
.rTopItem1Extra{
  background: url(${require("./img/online.svg")});
   width: 52px;
    height: 52px;
    margin: auto;
    background-size: 100%;
    background-position-x: 0;
    background-repeat: repeat-x;
    position: absolute;
    left: 24px;
    top: 27px;
}
.rTopItem2Extra{
  background: url(${require("./img/totaldevice.svg")});
   width: 52px;
    height: 52px;
    margin: auto;
    background-size: 100%;
    background-position-x: 0;
    background-repeat: repeat-x;
    position: absolute;
    left: 24px;
    top: 27px;
}
.rTopItem3Extra{
  background: url(${require("./img/on.svg")});
   width: 52px;
    height: 52px;
    margin: auto;
    background-size: 100%;
    background-position-x: 0;
    background-repeat: repeat-x;
    position: absolute;
    left: 24px;
    top: 27px;
}
.rTopItem4Extra{
  background: url(${require("./img/off.svg")});
   width: 52px;
    height: 52px;
    margin: auto;
    background-size: 100%;
    background-position-x: 0;
    background-repeat: repeat-x;
    position: absolute;
    left: 24px;
    top: 27px;
}
    .itemTitle{
      height: 50px;
    line-height: 50px;
    padding-left: 12px;
    font-size: 16px;
    color: #999;
    font-weight: bold;
    }
    path.ant-progress-circle-path {
    stroke: #ff5e5e;
}
path.ant-progress-circle-trail {
    stroke: #1c2a36;
}
.ant-progress-circle .ant-progress-inner {
  background-color: #233544;
}
.ant-tabs-bar {
  border-bottom: 0px solid #d9d9d9;
    }
    .ant-tabs-nav{
      margin:0 0 0 260px;
    }
    .ant-tabs-ink-bar{
      top:0;
    }



    .numberInfo .numberInfoTitle {
    color: #799eb8;
    font-size: 16px;
    margin-bottom: 16px;
    -webkit-transition: all .3s;
    -o-transition: all .3s;
    transition: all .3s;
}

.numberInfo .numberInfoSubTitle {
    color: #799eb8;
    font-size: 14px;
    height: 22px;
    line-height: 22px;
    overflow: hidden;
    -o-text-overflow: ellipsis;
    text-overflow: ellipsis;
    word-break: break-all;
    white-space: nowrap;
}
.numberInfo .numberInfoValue {
    margin-top: 4px;
    font-size: 0;

    -o-text-overflow: ellipsis;
    text-overflow: ellipsis;
    word-break: break-all;
    white-space: nowrap;
}
.numberInfolight .numberInfoValue > span {
    color: #799eb8;
}
.numberInfo .numberInfoValue > span {
    color: #799eb8;
    display: inline-block;
    line-height: 32px;
    height: 32px;
    font-size: 24px;
    margin-right: 32px;
}
.boardcontent .title {
    text-align: center;
    color: #7ba0bb;
    font-size: 16px;
    height: 80px;
    line-height: 80px;
    padding: 0 15px;
}
.boardcontent .subTitle {
    margin-left: 28px;
    color: #00ccff;
}


.ant-input {


    background-color: #2a3f50;
    color:#a5acb1;
    border: 1px solid #a5acb1;

}
.ant-select-selection{
  background-color: #2a3f50;
   color:#a5acb1;
    border: 1px solid #a5acb1;
}
    `}
          </style>
        </div>
      </section>;
  }

}
)

export default DisplayBoard;