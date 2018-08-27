import React from 'react';
import { Layout, Table, Button, Form, Input, Affix, Popover, Spin, Breadcrumb, Icon , DatePicker } from 'antd';
import { Chart, Geom, Axis, Tooltip, Legend, Coord, Label ,Guide,Shape,View} from 'bizcharts';
import { View as iView } from '@antv/data-set';
import { netdata } from './../../helper'
import RegionTree from './regionTree'
import createStore from '../createStore';
import moment from 'moment';
import { withRouter } from 'react-router'
import HisTable from './HisTable'
const FormItem = Form.Item;
const { Header, Content, Sider } = Layout;



const HisMana=  withRouter(class HisMana extends React.Component {
    constructor(props) {
        super(props);
    this.store = createStore({
        id:"",
        Slectkey:["-1"],
        regionname:"",
        devicesList:[],
        deviceDATA:[],
      });
    }
    state = {
        datetime:moment(Date.now()),
        dv:[],
        dvv:[],
        sourcedata: [],
        loading: false,
        loadingtree:false,
        regionname:"",
        checkname:"",
        checkid:"",
        checkstate:"",
    };


    componentDidMount() {
         this.reloadHis(["-1"],moment(Date.now()));

    };
    componentWillMount(){  
      let that=this;
        this.store.subscribe(() => {
        const { regionname,Slectkey } = this.store.getState();
              this.setState({regionname:regionname,checkid:Slectkey,datetime:moment(Date.now())})
          
                that.reloadHis(Slectkey,moment(Date.now()));
        })
    }
    reloadHis(Slectkey,time){
        let sj1 =time.format("YYYY-MM-DD")+" "+"00:00:01";
        let sj2 =time.format("YYYY-MM-DD")+" "+"23:59:59";
        let that =this;
        let r = {
            method: "POST",
            body: JSON.stringify({"opt":"QueryOnlineRate", "sj1":sj1,"sj2":sj2, "RegionId":parseInt( Slectkey[0])})
          };
          netdata("/QueryHisLog.epy", r).then(that.ondata.bind(this));


    }

    initdata(data){
        let data1=[]
        for(let i=0;i<data.length;i++){
            var time1 = new Date(data[i][0]);
            data1.push({ time:data[i][0], value:data[i][4]},)
        }

            this.setState({dv:data1})
    }
    ondata(res) {

        if (res.d.errCode == 0) {
                this.initdata(res.d.Values);
                this.setState({dvv:res.d.Values})
        } else {        
        }
      }


    clickreback(){
        this.props.history.replace('/AppsMana') 
    }
    
    renderHis(data){
        const cols = {
            value: {
                alias: '在线率' ,
                formatter: (val) => { return val+"%"}, // 格式化文本内容
            },
            time: {
                alias: '时间' ,
                mask: 'hh:mm:ss',
            }
          }
        return ( <Chart height={260} data={data} scale={cols} forceFit>
          <Axis name="time" />
          <Axis name="value"  />
          <Tooltip crosshairs={{type:'line'}}/>
          <Geom type="area" position="time*value" />
          <Geom type="line" position="time*value" size={2} />
          <Geom type="point" position="time*value" size={4} shape='circle' style={{stroke: '#fff',lineWidth: 1,fillOpacity: 1}}/>

        </Chart>)
    }

    timeonChange(date, dateString) {
        this.reloadHis(this.state.checkid,date);
        this.setState({datetime:date})
      }
      rendertabledata(data){
          let sdata=[]
        for(let i=0;i<data.length;i++){
            let xx={};
            xx["time"]=data[i][0];
            xx["id"]=data[i][1];
            xx["online"]=data[i][2];
            xx["total"]=data[i][3];
            xx["rate"]=data[i][4];
            sdata.push(xx)
        }
        return sdata;
      }
    render() {
        let that= this;
        return (
            <Layout >
                {/* <Sider id="myregiontreediv" width={275} style={{ height: window.innerHeight - 64, background: '#fff', boxShadow: "1px 0px 6px #dcd0d0", overflow: 'auto', position: 'fixed', left: this.props.mleft}}> */}
                <Sider id="myregiontreediv" width={275} style={{ height: window.innerHeight - 64, background: 'rgb(47, 70, 89)', boxShadow: "1px 0px 6px #dcd0d0", overflow: 'auto', position: 'fixed', left: 0}}>
                    <RegionTree store={this.store} ref="mytree"/>
                </Sider>
                <Layout>
                    <Content style= {{    overflow: "hidden"}}>
                        <div id="affix" >
                            <Affix offsetTop={64}>
                                <div className="table-operations">
                                    <span>
                                        <Breadcrumb style={{ fontSize: "14px" }}>
                                            {/* <Breadcrumb.Item>江苏</Breadcrumb.Item>
                                            <Breadcrumb.Item>无锡</Breadcrumb.Item> */}
                                            <Breadcrumb.Item>{this.state.regionname+"    (在线率历史曲线)"}</Breadcrumb.Item>
                                        </Breadcrumb>
                                    </span>
                                
                                    {/* <span> 

                                        <Button  style={{marginLeft:"10px"}}  icon="left"   type="primary" onClick={this.clickreback.bind(this)} >返回</Button>
                                    </span> */}
                                </div>
                            </Affix>                      
                        </div> 
                        <div style={{padding: "12px 24px"}}>
                        <FormItem           labelCol={{ span: 2 }}
                            wrapperCol={{ span: 5 }} label="查询时间">
                          <DatePicker size="large" value={this.state.datetime} onChange={this.timeonChange.bind(this)} /> 
                        </FormItem>
                        </div>
                        {this.renderHis(this.state.dv)}
                        <div style={{height:100}}> 

                        <HisTable sourcedata={this.rendertabledata(this.state.dvv)}/>

                        </div>
                    </Content>
                </Layout>



                <style>{`
                 .ant-tree-title {
                        font-size: 14px;
                    }
                    .ant-tree-node-selected .ant-tree-title, .ant-tree-node-selected:hover .ant-tree-title {
                        color: #fff;
                    }
                     .ant-tree-switcher,  .ant-tree-title {
                        color: #7ba0bb;
                    }
                    .ant-tree-node-selected, .ant-tree-node-selected:hover {
                    background-color: #1c2a36 !important;
                }
                .ant-tree-node-content-wrapper:hover {
                    background-color: #1c2a36 !important;
                }
                .ant-tree-node-content-wrapper:hover .ant-tree-title {
                        color: #fff;
                    }
                    `}</style>



    


            </Layout>

        );
    }
}
);
export default HisMana;