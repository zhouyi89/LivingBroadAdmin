import React from 'react';
import { Form, Row, Col, Input, Icon,TimePicker , Select, notification, Modal,message,Slider } from 'antd';
import { netdata } from './../../helper';
import { withRouter } from 'react-router'
import NewsFrom from './newsFrom'
import moment from 'moment';
const FormItem = Form.Item;
const { Option } = Select;


const MyNewsFrom = Form.create()(NewsFrom);
var newssetdata = [];

const AdvancedSearchForm= withRouter( class AdvancedSearchForm extends React.Component {
        constructor(props) {
            super(props);
        }
  state = {
    expand: false,
    expandform: true,
    broadtype: "1",
    newssetmodal: false,
    chldata:[]
  };
  componentDidMount() {
          let that =this;
          let r = {
            method: "POST",
            body: JSON.stringify({"opt":"getBroadcastChlList"})
        }
        netdata('/BroadcastChlOpt.epy', r).then(that.ondataChlList.bind(this));
  }

   ondataChlList(res) {
    if(res.d.errCode === "Cookie过期"){
      this.props.history.replace('/power')
    }
       if (res.s === false) {
           Notification['error']({
               message: '数据请求错误',
               description: JSON.stringify(res.d),
           });
           return;
       }
       if (res.d.errCode == 0) {
           let broadCastData = res.d.Values;
           console.log("broadCastData", broadCastData)
           let ccdata = []
           for (let i = 0; i < broadCastData.length; i++) {
               if (broadCastData[i].Enable === 'true') {
                   ccdata.push(broadCastData[i]);
               }
           }
           this.setState({chldata: ccdata});
       }
   }
  handleBroadCreat = (e) => {
    e.preventDefault();
    const { store } = this.props;
    const { checkedKeystore, rootlogicaddr } = store.getState();
    this.props.form.validateFields((err, values) => {
      let data = [];
      for (let dd in values) {
        data.push(values[dd]);
      }
      let databody = {};
      let filePath = "";
      filePath = this.props.MP3data!=[]?this.props.MP3data.filter(a=>a.id==data[1])[0].Path:"请选择";
      databody["opt"] = "AddBroadcast";
      databody["Mode"] = parseInt(data[0]);
      databody["FileName"] = filePath;
      databody["SourceLogic"] = rootlogicaddr;
      databody["RemoteLogic"] = rootlogicaddr;
      databody["Volume"] = 16;
      databody["EBM_Lever"] = 6;
      databody["TerminalList"] = checkedKeystore;
      let r = {
        method: "POST",
        body: JSON.stringify(databody)
      }
      netdata('/BroadcastOpt.epy', r).then(
        this.ondata.bind(this)
      )
    });
  }
  ondata(type,res) {
    if(res.d.errCode === "Cookie过期"){
      this.props.history.replace('/power')
    }
    if (res.d.errCode == 0) {
      const { store } = this.props;
      const { livelistsource } = store.getState();
      store.setState({ livelistsource: [...livelistsource, res.d.Values],lineinfo:true,lineid:res.d.Values.Index ,alarm:res.d.Values.EBM_Lever===14});
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
  ondata1(type,res) {
    if(res.d.errCode === "Cookie过期"){
      this.props.history.replace('/power')
    }
    if(res.d.errCode == 0){
      this.props.OnReload();
      const { store } = this.props;
      store.setState({lineinfo:true,lineid:res.d.Values.Index,alarm:res.d.Values.EBM_Lever===14 });
      notification["success"]({
        message: type,
        description: "",
        duration:1.5
      });
    }
    else{
      notification["error"]({
        message: res.d.errCode,
        description: "",
        duration:1.5
      });
    }
  }
  handleReset = () => {
    this.props.form.resetFields();
  }
  submitlivedata() {
    const { store } = this.props;
    const { checkedKeystore, rootlogicaddr,markerinfostore } = store.getState();
    let checkedKeys =checkedKeystore
    if(checkedKeystore[0]==''){
      checkedKeys=[];
    }
    this.props.form.validateFields((err, values) => {
        // let filePath = (this.props.MP3data!=[]&&this.props.MP3data.filter(a=>a.id==values['FileName'])!="")?this.props.MP3data.filter(a=>a.id==values['FileName'])[0].Path:"请选择";
        let databody = {};
      switch (values['BroadType']) {
        case "1":
          databody["opt"] = "AddBroadcast";
          databody["Mode"] = parseInt(values['BroadType']);
          databody["FileListIndex"] =values['FileName'];
          databody["StopTime"] =values['StopTime'].format("HH:mm:ss");
          databody["SourceLogic"] = rootlogicaddr;
          databody["RemoteLogic"] = rootlogicaddr;
          databody["Volume"] = parseInt(values['Vol']);
          databody["EBM_Lever"] = parseInt(values['NewsLevel']);
          databody["TerminalList"] = checkedKeys;
            if(values['FileName']==="")
            {
                message.info("请选择播放列表！")
                return;
            }
          let r1 = {
            method: "POST",
            body: JSON.stringify(databody)
          }
          netdata('/BroadcastOpt.epy', r1).then(
            this.ondata.bind(this,"文件广播创建成功")
          )
          break;
        case "2":
          databody["opt"] = "StartDevBroadcast";
          // databody["Mode"]=parseInt(values['BroadType']);
          databody["ChannelSelect"] = parseInt(values['ChannelSelect']);
          databody["SourceLogic"]=rootlogicaddr;
          databody["RemoteLogic"]=rootlogicaddr;
          databody["Volume"] = parseInt(values['Vol']);
          databody["EBM_Lever"] = parseInt(values['NewsLevel']);
          databody["TerminalList"] = checkedKeys;
          let r2 = {
            method: "POST",
            body: JSON.stringify(databody)
          }
          netdata('/DevBroadcastOpt.epy', r2).then(
            this.ondata1.bind(this,"设备广播创建成功")
          )
          break;
        case "3":
          databody["opt"] = "OnStartBroadcast"; 
              if(checkedKeys.length===0){
            message.info("请选择音柱！")
            return;
          }
          // databody["Mode"]=parseInt(values['BroadType']);
          databody["Txt"] = values['newscontent'];
          databody["SourceLogic"]=rootlogicaddr;
          databody["RemoteLogic"]=rootlogicaddr;
          databody["Mode"] = parseInt(newssetdata['showMode'])||1;
          databody["RepeatTimes"] = parseInt(newssetdata['RepeatTimes'])||1;
          databody["Volume"] = parseInt(values['Vol']);
          databody["EBM_Lever"] = parseInt(values['NewsLevel']);
     
          databody["TerminalList"] = checkedKeys;
          let r3 = {
            method: "POST",
            body: JSON.stringify(databody)
          }
          netdata('/DevSpeechsynthesizerOpt.epy', r3).then(
            this.ondata1.bind(this,"短讯广播创建成功")
          )
          break;
        case "5":
          databody["opt"] = "AddNetBroadcast";
          // databody["Mode"]=parseInt(values['BroadType']);
          databody["ProgramId"] = values['broadchl'];
          databody["SourceLogic"]=rootlogicaddr;
          databody["RemoteLogic"]=rootlogicaddr;
          databody["Volume"] = parseInt(values['Vol']);
          databody["EBM_Lever"] = parseInt(values['NewsLevel']);
          databody["TerminalList"] = checkedKeys;
          if(values['broadchl']==="")
            {
                message.info("请选择广播节目！")
                return;
            }
          let r5 = {
            method: "POST",
            body: JSON.stringify(databody)
          }
          netdata('/BroadcastOpt.epy', r5).then(
            this.ondata.bind(this,"网络广播创建成功")
          )
          break;
      }
    });
  }
  submitlivedataeme() {
    const { store } = this.props;
    const { checkedKeystore, rootlogicaddr } = store.getState();
    let checkedKeys =checkedKeystore
    if(checkedKeystore[0]===''){
      checkedKeys=[];
    }
    this.props.form.validateFields((err, values) => {

      // let filePath = (this.props.MP3data!=[]&&this.props.MP3data.filter(a=>a.id==values['FileName'])!="")?this.props.MP3data.filter(a=>a.id==values['FileName'])[0].Path:"请选择";
      let databody = {};
      switch (values['BroadType']) {
        case "1":
          databody["opt"] = "AddBroadcast";
          databody["Mode"] = parseInt(values['BroadType']);
          databody["FileListIndex"] =values['FileName'];
          databody["StopTime"] =values['StopTime'].format("HH:mm:ss");
          // databody["FileName"] = filePath;
          databody["SourceLogic"] = rootlogicaddr;
          databody["RemoteLogic"] = rootlogicaddr;
          databody["Volume"] = parseInt(values['Vol']);
          databody["EBM_Lever"] = 14;
          databody["TerminalList"] = checkedKeys;

          if(values['FileName']==="")
          {
            message.info("请选择播放列表！")
              return;
          }

          let r1 = {
            method: "POST",
            body: JSON.stringify(databody)
          }
          netdata('/BroadcastOpt.epy', r1).then(
            this.ondata.bind(this,"文件广播创建成功")
          )
          break;
        case "2":
          databody["opt"] = "StartDevBroadcast";
          // databody["Mode"]=parseInt(values['BroadType']);
          databody["ChannelSelect"] = parseInt(values['ChannelSelect']);
          databody["SourceLogic"]=rootlogicaddr;
          databody["RemoteLogic"]=rootlogicaddr;
          databody["Volume"] = parseInt(values['Vol']);
          databody["TerminalList"] = checkedKeys;
          databody["EBM_Lever"] = 14;
          let r2 = {
            method: "POST",
            body: JSON.stringify(databody)
          }
          netdata('/DevBroadcastOpt.epy', r2).then(
            this.ondata1.bind(this,"设备广播创建成功")
          )
          break;
        case "3":
          databody["opt"] = "OnStartBroadcast";
          // databody["Mode"]=parseInt(values['BroadType']);
          databody["Txt"] = values['newscontent'];
          databody["SourceLogic"]=rootlogicaddr;
          databody["RemoteLogic"]=rootlogicaddr;
          databody["Mode"] = parseInt(newssetdata['showMode']);
          databody["RepeatTimes"] = parseInt(newssetdata['RepeatTimes']);
          databody["Volume"] = parseInt(values['Vol']);
          databody["EBM_Lever"] = 14;
          databody["TerminalList"] = checkedKeys;
          let r3 = {
            method: "POST",
            body: JSON.stringify(databody)
          }
          netdata('/DevSpeechsynthesizerOpt.epy', r3).then(
            this.ondata1.bind(this,"短讯广播创建成功")
          )
          break;
        case "5":
          databody["opt"] = "AddNetBroadcast";
          // databody["Mode"]=parseInt(values['BroadType']);
          databody["ProgramId"] = values['broadchl'];
          databody["SourceLogic"]=rootlogicaddr;
          databody["RemoteLogic"]=rootlogicaddr;
          databody["Volume"] = parseInt(values['Vol']);
          databody["EBM_Lever"] = 14
          databody["TerminalList"] = checkedKeys;
          if(values['broadchl']==="")
            {
                message.info("请选择广播节目！")
                return;
            }
          let r5 = {
            method: "POST",
            body: JSON.stringify(databody)
          }
          netdata('/BroadcastOpt.epy', r5).then(
            this.ondata.bind(this,"网络广播创建成功")
          )
          break;
      }
    });
  }
  toggle = () => {
    const { expandform } = this.state;
    expandform ? this.props.callbackParent(80) : this.props.callbackParent(160);
    this.setState({ expandform: !expandform });
  }
    randerChlList(data){
      return data.map((item) => {
        return <Option value={item.id}>{item.Name}</Option>
      });
    }

    renderMp3File(data){
        return data.map((item) => {
            return <Option value={item.id}>{item.Name}</Option>
        });
    }
  broadtypechild(type) {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };

    switch (type) {
      case "1":
        return (
          <div>
          <Col span={11}>
            <FormItem {...formItemLayout} label={`节目单`}>
              {getFieldDecorator(`FileName`, {
                initialValue: "",
              })(
                <Select size="default" placeholder="请选择" style={{ width: '100%' }}>
              {/*<Option value="pth.mp3">普通话</Option>*/}
              {/*<Option value="kz.mp3">男生</Option>*/}
              {/*<Option value="ns.mp3">女生</Option>*/}
              {this.renderMp3File(this.props.MP3data)}
                  </Select>
                )}
            </FormItem>
          </Col>
          <Col span={11}>
            <FormItem {...formItemLayout} label={`结束时间`} >
              {getFieldDecorator(`StopTime`, {
                initialValue: moment(moment().add('hours',1), 'HH:mm:ss'),
              })(
                <TimePicker allowEmpty={false} format={'HH:mm:ss'}  style={{ width: '100%' }}/>,                
                )}
            </FormItem>
          </Col>
          </div>)
        break;
      case "2":
        return (
         <div>
          <Col span={1}>
          </Col>
          <Col span={11}>
            <FormItem {...formItemLayout} label={`音源通道`}>
                {getFieldDecorator(`ChannelSelect`, {
                    initialValue: '0',
                })(
                    <Select size="default" placeholder="请选择" style={{ width: '100%' }}>
                      <Option value="0">线路一</Option>
                      <Option value="1">线路二</Option>
                      <Option value="2">话筒</Option>
                      <Option value="3">MP3</Option>
                    </Select>
                )}
            </FormItem>
          </Col>
          </div>)
          break;
      case "3":
        return (
          <div>
          <Col span={1}>
          </Col>
          <Col span={11}>
            <FormItem {...formItemLayout} label={`短讯内容`}>
              {getFieldDecorator(`newscontent`, {
                initialValue: '',
              })(
                <Input disabled addonAfter={<Icon onClick={this.newsset.bind(this)} type="setting" />} />

                )}
            </FormItem>
          </Col>
          </div>)
        break;
      case "5":
        return (
          <div>
          <Col span={1}>
          </Col>
          <Col span={11}>
            <FormItem {...formItemLayout} label={`广播节目`}>
              {getFieldDecorator(`broadchl`, {
                initialValue: '',
              })(
                <Select size="default" placeholder="请选择" style={{ width: '100%' }}>
                    {this.randerChlList(this.state.chldata)}
                </Select>

                )}
            </FormItem>
          </Col>
          </div>)
        break;
    }

  }
  newsset() {
    this.setState({ newssetmodal: true })
  }
  modalhide() {
    this.setState({ newssetmodal: false })
  }
  newFormsub() {

    let values = this.formRef.getnewFromdata();
    newssetdata = values;
    this.props.form.setFieldsValue({

      newscontent: values.Txtcontent

    });
    this.setState({ newssetmodal: false })
  }
  broadtypeselect(value, option) {
    this.setState({ broadtype: value })
  }

  advanceform() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
    return (

      <Form
        className="ant-advanced-search-form"
        onSubmit={this.handleBroadCreat1}
      >

        <Col span={11}>
          <FormItem {...formItemLayout} label={'广播类型'}>
            {getFieldDecorator(`BroadType`, {
              initialValue: '1',
            })(
              <Select size="default" placeholder="请选择" style={{ width: '100%' }} onSelect={this.broadtypeselect.bind(this)}>
                <Option value="1">文件广播</Option>
                <Option value="2">设备广播</Option>
                <Option value="3">短讯广播</Option>
                {/* <Option value="4">图片广播(建设中)</Option> */}
                <Option value="5">网络广播</Option>
              </Select>
              )}
          </FormItem>
        </Col>
        {this.broadtypechild(this.state.broadtype, "advance")}
        <Col span={11}>
          <FormItem {...formItemLayout} label={`消息类型`} style={{ width: '100%' }} >
            {getFieldDecorator(`NewsType`, {
              initialValue: 'type0',
            })(
              <Select size="default" placeholder="请选择"   >
                <Option value="type0">测试专用</Option>
                <Option value="type1">突发事件</Option>
                <Option value="type2">水旱灾害</Option>
                <Option value="type3">洪水</Option>
                <Option value="type4">内涝</Option>
                <Option value="type5">水库重大险情</Option>
                <Option value="type6">传染病事件</Option>
              </Select>
              )}
          </FormItem>
        </Col>
        <Col span={1}>
        </Col>
        <Col span={11}>
          <FormItem {...formItemLayout} label={`消息级别`} >
            {getFieldDecorator(`NewsLevel`, {
              initialValue: '6',
            })(
              <Select size="default" placeholder="请选择" style={{ width: '100%' }} >
                <Option value="6">一般</Option>
                <Option value="7">较大</Option>
                <Option value="8">重大</Option>
                <Option value="9">特别重大</Option>
              </Select>
              )}
          </FormItem>
        </Col>
        <Col span={11}>
          <FormItem {...formItemLayout} label={`音量大小`} >
            {getFieldDecorator(`Vol`, {
              initialValue: '16',
            })(
              // <Select size="default" placeholder="请选择" style={{ width: '100%' }} >
              //   <Option value="0">0</Option>
              //   <Option value="8">8</Option>
              //   <Option value="16">16</Option>
              //   <Option value="24">24</Option>
              //   <Option value="32">32</Option>
              // </Select>
              <Slider min={0} max={32} step={8}  />
              )}
          </FormItem>
        </Col>
        <Modal
          title="短讯内容设置"
          visible={this.state.newssetmodal}
          onOk={this.newFormsub.bind(this)}
          onCancel={this.modalhide.bind(this)}
          okText="确认"
          cancelText="取消"
          width={400}
        >
          <MyNewsFrom wrappedComponentRef={(inst) => this.formRef = inst} />
        </Modal>
      </Form>
    );
  }
  simpleform() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 7, color: "#fff" },
      wrapperCol: { span: 17 },
    };
    return (
      <Form
        className="ant-advanced-search-form"
        onSubmit={this.handleBroadCreat}
      >

        <FormItem {...formItemLayout} label={'广播类型'}>
          {getFieldDecorator(`broadtype-sim`, {
            initialValue: '1',
          })(
            <Select size="default" placeholder="请选择" style={{ width: '100%' }} onSelect={this.broadtypeselect.bind(this)}>
              <Option value="1">文件广播</Option>
              <Option value="2">设备广播</Option>
              <Option value="3">短讯广播</Option>
              <Option value="4">图片广播</Option>
              <Option value="5">网络广播</Option>
            </Select>
            )}
        </FormItem>
        {this.broadtypechild(this.state.broadtype, "simple")}
        <Row>
          <Col span={24} style={{ textAlign: 'right' }}>
            {/* <Button type="primary" htmlType="submit">广播</Button>
            <Button style={{ marginLeft: 8 }} htmlType="submit">应急广播</Button> */}
            <a style={{ marginLeft: 8, fontSize: 12 }} onClick={this.toggle}>
              展开 <Icon type={this.state.expand ? 'up' : 'down'} />
            </a>
          </Col>
        </Row>


      </Form>
    );
  }
  render() {
    //  return this.state.expandform ? this.advanceform() : this.simpleform();
    return this.advanceform();
  }
}
)
export default AdvancedSearchForm;