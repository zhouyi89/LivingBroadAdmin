import React from 'react';
import { Layout, Icon, Table, Button, Input, Form,Affix,Collapse,Switch,Popconfirm,notification,Tooltip,message } from 'antd';
import createStore from '../createStore.js';
import { withRouter } from 'react-router'
import { netdata } from './../../helper'
import SubForm from './subForm'
import BasicForm from './basicForm'
import RegionTag from './regionTag'
import ContentForm from './contentForm'
import ECimg from './TimeLogo.png';

const {  Sider } = Layout;
const Search = Input.Search;
const Panel = Collapse.Panel;
const SubFormIN = Form.create()(SubForm);
const BasicFormIN = Form.create()(BasicForm);
const ContentFormIN = Form.create()(ContentForm);



let GBLis=null;
const TimingBroad=  withRouter(class TimingBroad extends React.Component {
    constructor(props) {
        super(props);
        // 初始化 store
        this.store = createStore({
            BroadcastData:[],
            id:1
        });
    }
    state = {
        dataSource:[],
        checkKEY:1,
        showright:true
    };
    newTimeBroad(){
        var that = this;
        var myDate = new Date();
        var mytime=myDate.getMilliseconds();
        let r = {
          method: "POST",
          body: JSON.stringify({"opt":"AddBroadcast","Enable":"0","LevelId":"6","Name":"新建定时广播"+mytime,"Type":"2","Volume":"16","CircleMode":"2","DaySelect":"","StartTime":"8:00","EndTime":"10:00","Region":"","Data":{"FileName":""}})
        }
        netdata('/ProcessBroadcastOpt.epy', r).then(
          that.reload.bind(that,'new','')
        )
    }
    filterName(value){
        this.reload("",value)
    }
    reload(id,filterName){
        var that = this;
        let r = {
          method: "POST",
          body: JSON.stringify({ "opt": "GetBroadcast","Name":filterName })
        }
        netdata('/ProcessBroadcastOpt.epy', r).then(
          that.onBCdata.bind(that,id)
        )
    }
    componentWillMount(){
        this.reload("","")
    }
    componentDidMount(){

    }
    onBCdata(id,res) {
        if(res.d.errCode === "Cookie过期"){
            this.props.history.replace('/power')
          }
        try {
                    if (res.d.errCode == 0) {
            let mydata = res.d.Values
            if(mydata.length>0){
                let storedata = [];
                for (let i = 0; i < mydata.length; i++) {
                    mydata[i].key = mydata[i].id;
                    storedata[mydata[i].id] = mydata[i]
                }

                this.setState({ dataSource: mydata ,showright:true})
                if(id===""){
                    this.store.setState({ BroadcastData: storedata, id: mydata[0].id });  
                                   let Cbtnq = document.querySelectorAll("td.tableClick");
                for (let i = 0; i < Cbtnq.length; i++) {
                    Cbtnq[i].parentNode.style.backgroundColor = "";
                }
                Cbtnq[0].parentNode.style.backgroundColor = "#1c2a36";
                }else if(id==="new"){
                    this.store.setState({ BroadcastData: storedata, id: mydata[mydata.length-1].id });  
                    let Cbtnq = document.querySelectorAll("td.tableClick");
                    for (let i = 0; i < Cbtnq.length; i++) {
                        Cbtnq[i].parentNode.style.backgroundColor = "";
                    }
                    Cbtnq[Cbtnq.length-1].parentNode.style.backgroundColor = "#1c2a36";
                }
                else{
                    this.store.setState({ BroadcastData: storedata, id: id }); 
                }
               


             }else{
                this.setState({dataSource: [] , showright:false})
             }
        }
        else {
            
        }
        } catch (error) {
            
        }

      }
    SubALLdata(){
        const { id,BroadcastData } = this.store.getState();
        let NameDATA =this.formRefSub.NameDATA();
       let basicDATA= this.formRef.basicDATA();
       let contentDATA =this.formRefCON.contentDATA();
       let regiondata=  this.refs.getregions.GETregion();

        let databody={}
        databody["opt"] = "MfyBroadcast";
        databody["id"] = id;
        databody["Enable"] =BroadcastData[id].Enable;
        databody["LevelId"] = basicDATA.level;
        databody["Name"] = NameDATA.Name;
        databody["Type"] = contentDATA.contentType;
        databody["Volume"] = basicDATA.vol.toString();
        databody["CircleMode"] = basicDATA.playcircle.mode;
        let dayselect='';
        for(let i=1;i<basicDATA.playcircle.dayselect.length;i++){
            if(i!=basicDATA.playcircle.dayselect.length-1){
                dayselect+=basicDATA.playcircle.dayselect[i]+','
            }else{
                dayselect+=basicDATA.playcircle.dayselect[i]
            }
            
        }
        
        databody["DaySelect"] = dayselect;
        databody["StartTime"] = basicDATA.timerange.start;
        databody["EndTime"] = basicDATA.timerange.end;
        if(regiondata.length==0||isNaN(regiondata[0])){
            message.error('请选择广播区域！');
            return;
        }

        let Rdata='';
        for(let i=0;i<regiondata.length;i++){
            if(i!=regiondata.length-1){
                Rdata+=regiondata[i]+','
            }else{
                Rdata+=regiondata[i]
            }
            
        }
        databody["Region"] = Rdata;
        switch(contentDATA.contentType){
            case "2":
                    if(contentDATA.Txtcontent==""){
                        message.error('请输入短讯内容！');
                        return;
                    }
                    if(typeof(contentDATA.showMode)=="undefined"){
                        message.error('请输入短讯模式！');
                        return;
                    }
                    if(typeof(contentDATA.RepeatTimes)=="undefined"){
                        message.error('请输入重复次数！');
                        return;
                    }
                databody["Data"] = {"Mode":contentDATA.showMode, "RepeatTimes":contentDATA.RepeatTimes, "Txt":contentDATA.Txtcontent};
                break;
            case "3":
                     if(typeof(contentDATA.broadchl)=="undefined"){
                        message.error('请选择广播节目！');
                        return;
                     }
                databody["Data"] = {"ChannelId":contentDATA.broadchl};
                break;
            case "5":
                    if(typeof(contentDATA.FileName)=="undefined"){
                        message.error('请选择MP3文件！');
                        return;
                    }
                // databody["Data"] = {"FileName":contentDATA.FileName.replace("/","//")};
                databody["Data"] = {"FileListIndex":contentDATA.FileName};
                break;
            case "6":
                databody["Data"] = {"Mode":contentDATA.ChannelSelect};
                break;
            default:
                databody["Data"] = {};
                break;
        }

        
        let r = {
        method: "POST",
        body: JSON.stringify(databody)
        }
        netdata('/ProcessBroadcastOpt.epy', r).then(
        this.ondata.bind(this,"保存成功！")
        )
      }


      ondata(type,res) {
        if(res.d.errCode === "Cookie过期"){
            this.props.history.replace('/power')
          }
        if (res.d.errCode == 0) {
            if(type==="保存成功！"){
                this.reload(res.d.Values.ID,'');
            }else if(type==="启用成功！"||type==="关闭成功！"){
                this.reload(res.d.Values.ID,'');
            }
            else{
                this.reload("",'');
            }
          
          notification["success"]({
            message: type,
            description: "",
            duration: 1.5
          });
        }
        else {
          notification["error"]({
            message: res.d.errCode,
            description: "",
            duration: 1.5
          });
        }
      }
    componentDidUpdate() {
        let Cbtn = document.querySelectorAll("td.tableClick");
        let that =this;
        var myFunc =function () {
            let id =this.parentNode.querySelector('.myId').id;
            that.setState({checkKEY:parseInt(id)});
            that.store.setState({id:parseInt(id)});
            let Cbtnq = document.querySelectorAll("td.tableClick");
                for (let i = 0; i < Cbtnq.length; i++) {
                    Cbtnq[i].parentNode.style.backgroundColor = "";

                }
                this.parentNode.style.backgroundColor = "#1c2a36";
        } 
    
     
        for (let i = 0; i < Cbtn.length; i++) {
            Cbtn[i].addEventListener('click', myFunc);
        }
        if(GBLis!=null){
            
            for (let i = 0; i < GBLis.length; i++) {
                GBLis[i].removeEventListener('click', myFunc); 
            }
        }
        GBLis=Cbtn;
        //    Cbtn.addEventListener('click', function () {
        //             alert(1)
        //       });
    }
    confirm(id){
        // let id =this.props.id;
        let that =this;
        let databody ={}
        databody["opt"] ="DelBroadcast";
        databody["id"] =id.toString();
        let r1 = {
            method: "POST",
            body: JSON.stringify(databody)
            }
            netdata('/ProcessBroadcastOpt.epy', r1).then(
                 that.ondata.bind(this,"删除成功！")
            )
    }
    getBLen(str) {
        if (str == null) return 0;
        if (typeof str != "string") {
            str += "";
        }
        return str.replace(/[^\x00-\xff]/g, "01").length;
    }
    switchonChange(id,checked){
        let that =this;
        let databody ={}
            databody["opt"] ="ProcessEnable";
            databody["id"] =id;
            databody["Enable"] =checked?"1":"0";
            let mystr =checked?"启用成功！":"关闭成功！";
            let r1 = {
                method: "POST",
                body: JSON.stringify(databody)
                }
                netdata('/ProcessBroadcastOpt.epy', r1).then(
                     that.ondata.bind(this,mystr)
                )
    }
    render() {
        const customPanelStyle = {
            background: '#f7f7f7',
            borderRadius: 4,
            marginBottom: 24,
            border: 0,
            overflow: 'hidden',
          };


          const columns = [
            {
                title: '序号', dataIndex: 'id', key: 'id', className: 'tableClick',width:47,
                 render: (text, record, index) =><div className ="myId" id={text} > {index+1}</div>
                 
        
            },
            {
                title: '名称', dataIndex: 'Name', key: 'name', className: 'tableClick',width:144,
                render: (text, record, index) =>{
                    // let len = this.getBLen(text);
                    let len =text.length;
                    let txt;
                    let pop;
                    if (len > 9) {
                        txt = text.substring(0, 9) + "...";
                        pop = (<Tooltip placement="top" title={text} arrowPointAtCenter>
                        <a>{txt}</a></Tooltip>);
                    }
                    else {
                        pop = (<a>{text}</a>);
                    }
                    return pop
                }
                
                
                
            },
            {
                title: '类型', dataIndex: 'Type', key: 'Type', className: 'tableClick',width:48,
                render: (text, record, index) =>{
                    switch(text){
                        case '1':
                            return "图片"
                            break;
                        case '2':
                            return "短讯"
                            break;
                        case '3':
                            return "网络"
                            break;
                        case '4':
                            return "视频"
                            break;
                        case '5':
                            return "文件"
                            break;
                        case '6':
                            return "设备"
                            break;
                    }
                }
            },
            {
                title: '状态', dataIndex: 'state', key: 'state', className: 'tableOp',width:59,
                // render: (text, record, index) => index % 3 === 0 ? <span style={{ color: 'red' }}>停用</span> : <span style={{ color: '#54ff60' }}>广播中</span>
                render: (text, record, index) => {let en =record.Enable=="1"?true:false;return <Switch  size="small" defaultChecked={en} onChange={this.switchonChange.bind(this,record.id)}/>}
            },
            { title: '操作', dataIndex: '', key: 'x', className: 'tableOp',width:44, render: (text, record, index) => <Popconfirm id={record.id} title="确认删除当前广播?" onConfirm={this.confirm.bind(this,record.id)}  okText="是" cancelText="否"> <Icon style={{ cursor: "pointer", color: "rgb(0, 201, 252)" }} type="delete" /></Popconfirm> },
        ];
        return (
            <section id="myebody" className="e-body" style={{ height: window.innerHeight }}>
                <div className="my-content">
                    <Layout>
                        <Sider width={400} style={{ overflow: "hidden", height: "100%", background: '#2f4659', boxShadow: "1px 0px 6px #dcd0d0", position: 'fixed', left: 0 }}>
                            <div id="timingb" style={{ padding: "16px 16px" }}>
                                <div className="table-operations">
                                    <Button className="buttonType1" type="primary" icon="plus" onClick={this.newTimeBroad.bind(this)}>新增定时广播</Button>
                                    <Button className="buttonType2" icon="reload" onClick={this.reload.bind(this,'','')}>刷新</Button>
                                    <Search
                                        className="buttonType2"
                                        placeholder="搜索广播"
                                        onSearch={value => this.filterName(value)}
                                        style={{ width: 150 }}
                                    />
                                </div>
                                <Table bordered columns={columns} pagination={false}
                                    scroll={{y:window.innerHeight-180}}
                                    dataSource={this.state.dataSource} />

                            </div>
                        </Sider>
                        {this.state.showright?  <Layout style={{ marginLeft: 400 }}>
                            {/* <div className="topbar">                */}
                              <Affix offsetTop={64}>
                                <div className="topbar">
                                    <SubFormIN  store={this.store} wrappedComponentRef={(inst) => this.formRefSub = inst}  saveSub={this.SubALLdata.bind(this)}/>
                                </div>
                              </Affix>
                              <div id="livecontent" style={{backgroundColor:"#FFF",padding:" 17px 19px"}}>
                              <Collapse bordered={false}   defaultActiveKey={['1','2','3']}>
                                <Panel disabled showArrow={false} header="基本参数" key="1" >
                                     <BasicFormIN store={this.store}  wrappedComponentRef={(inst) => this.formRef = inst}/>
                                </Panel>
                                <Panel disabled showArrow={false} header="广播区域" key="2" >
                                     <RegionTag ref="getregions" store={this.store}/>
                                </Panel>
                                <Panel disabled showArrow={false} header="广播内容" key="3" >
                                     <ContentFormIN store={this.store} wrappedComponentRef={(inst) => this.formRefCON = inst}/>
                                </Panel>
                            </Collapse>
                                </div>
                            {/* </div> */}
                        </Layout>:<Layout style={{ marginLeft: 400 }}>
                                <div style={{ height: window.innerHeight-64,background: "#fff"}}>
                                    <div className="emptyContent"> 
                                        <div className="ecImg"></div>
                                        <div className="ecText">未创建定时广播，请点击添加按钮添加</div>
                                        <div><Button size= 'large' type="primary" onClick={this.newTimeBroad.bind(this)}>新增定时广播</Button></div>
                                    </div>
                                  
                                </div>
                            </Layout>}
                    </Layout>

                    <style>{`
                .emptyContent{
                    padding-top: 10%;
                    text-align: center;
                    width: 72%;
                    margin: 0 auto;
                    overflow:hidden
                }
                .ecText{
                    font-size: 24px;
                    color: rgba(0, 0, 0, 0.85);
                    font-weight: 500;
                    line-height: 32px;
                    margin-bottom: 20px;
                }
                .ecImg{
                    width: 300px;
                    height: 300px;
                    background-image: url(${ECimg});
                    background-position: 50%;
                     background-size: contain;
                     margin-left: 33%;
                     margin-bottom:30px
                }
          #myebody .ant-menu-item:hover{
            background-color: transparent; 
              }
              .table-operations {
            margin-bottom: 16px;
            }

            .table-operations > button {
            margin-right: 8px;
    
            }   
             #timingb .buttonType2,#timingb input{
            border-color: rgba(255, 255, 255, 0.1);
            color: #7ba0bb;
            background-color: transparent; 
             } 
             #timingb  td, #timingb  th {
                padding: 10px 8px;
                background: transparent;
                border-bottom-color: rgba(255, 255, 255, 0.1);
    border-right-color: rgba(255, 255, 255, 0.1)
             }
             #timingb .ant-table-tbody  tr:hover{
                background-color: #1c2a36;
             }
             #timingb table{
                background-color: #2f4659 !important;
                color: #7ba0bb;
                border-color: rgba(255, 255, 255, 0.1);
                border-radius: 0;
             }
             #timingb  .ant-table-bordered.ant-table-fixed-header {
                border: 1px solid #435768;
            }
             #timingb .tableClick{
                cursor: pointer;  
                  text-align: center;
             }
             #timingb .tableOp{
   
                  text-align: center;
             }

             #timingb .ant-table-placeholder {
                background: transparent;
                border-bottom: 1px solid transparent;
            }
            #timingb ::-webkit-scrollbar {
                display:none
            }
            #timingb .ant-table-header{
                overflow-x:hidden
            }
            #timingb .ant-table-fixed-header .ant-table-body{
                margin-top: 16px;
            }
             .contentWrapper{
                width: 100%;
    height: 100%;
    padding: 16px 16px;

             }
             .topbar{
                padding-top: 10px;
                padding-left: 16px;
                padding-right: 16px;
                padding-bottom: 10px;
                background-color: aliceblue;
             }

            #livecontent  .ant-collapse-header{
                 cursor:default;
                 color:#000;
             }
              `}
                    </style>
                </div>
            </section>

        )
    }

}
)

export default TimingBroad;