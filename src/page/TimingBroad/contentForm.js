import React from 'react';
import { Form, Input, Select,Radio ,InputNumber } from 'antd';

import { netdata } from './../../helper'
const { TextArea } = Input;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
class contentForm extends React.Component {
  state = {
    checkKey:"2",
    chldata:[],
    MP3data:[]
  };
  onChange(e) {
    console.log(`radio checked:${e.target.value}`);
    this.setState({checkKey:e.target.value})
  }

  componentDidMount(){
    this.props.store.subscribe(() => {
        const { BroadcastData,id } = this.props.store.getState();
        // this.setState({Name:BroadcastData[id].Name})
        this.setState({checkKey:BroadcastData[id].Type})
        switch(BroadcastData[id].Type){
          case '2':       
                this.props.form.setFieldsValue({
                  contentType:BroadcastData[id].Type,  
                  RepeatTimes: BroadcastData[id].Data.RepeatTimes,
                  showMode:BroadcastData[id].Data.Mode,
                  Txtcontent:BroadcastData[id].Data.Txt,
                });
                break;
          case '3':
                this.props.form.setFieldsValue({
                  contentType:BroadcastData[id].Type,  
                  broadchl:BroadcastData[id].Data.ChannelId,  
                });
                break;
          case '5':
                this.props.form.setFieldsValue({
                  contentType:BroadcastData[id].Type,  
                  FileName:BroadcastData[id].Data.FileListIndex,  
                });
                break;
          case '6':
                this.props.form.setFieldsValue({
                  contentType:BroadcastData[id].Type,  
                  ChannelSelect:BroadcastData[id].Data.Mode,  
                });
                break;
        }

      });

      let that =this;
      let r = {
        method: "POST",
        body: JSON.stringify({"opt":"getBroadcastChlList"})
    }
    netdata('/BroadcastChlOpt.epy', r).then(that.ondataChlList.bind(this));


    //  r = {
    //       method: "POST",
    //       body: JSON.stringify({"opt":"getMp3FileList"})
    //   }
    //   netdata('/MP3FileOpt.epy', r).then(this.ondataMp3List.bind(this));
    r = {
      method: "POST",
      body: JSON.stringify({"opt":"getFileListTable"})
    }
    netdata('/FileListOpt.epy', r).then(this.onfiletabledata.bind(this))   

  }

  onfiletabledata(res) {
    let Vdata = [];
    if (res.d.errCode == 0) {
        let Vs = res.d.Values;
        for (let i = 0; i < Vs.length; i++) {
            Vs[i]['key'] = Vs[i].id;
            Vdata.push(Vs[i]);
        }
        Vdata.sort(function (a, b) {
            return b.key - a.key
        });
        this.setState({MP3data: Vdata});
    }
}

ondataChlList(res) {
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


  contentDATA(){
    let contentDATA;
    this.props.form.validateFields((err, values) => {
      contentDATA= values
        // console.log("values",values)

    })
    return contentDATA;
  }
  randerChlList(data){
    return data.map((item) => {
      return <Option value={item.id}>{item.Name}</Option>
    });
  }
  // renderMp3File(data){
  //   return data.map((item) => {
  //       return <Option value={item.Path}>{item.Name}</Option>
  //   });
  renderMp3File(data){
    return data.map((item) => {
        return <Option value={item.id}>{item.Name}</Option>
    });
}
  renderOption(key){
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 1 },
        sm: { span: 2 },
      },
      wrapperCol: {
        xs: { span: 7 },
        sm: { span: 7 },
      },
    };
    switch (key) {
    case "3":
      return (
        <FormItem {...formItemLayout} label={`广播节目`}>
              {getFieldDecorator(`broadchl`, {
              })(
                <Select size="default" placeholder="请选择" style={{ width: '100%' }}>
                    {this.randerChlList(this.state.chldata)}
                </Select>

                )}
        </FormItem>
      )
      break;
    case "5":
      return (
        <FormItem {...formItemLayout} label={`节目单`}>
              {getFieldDecorator(`FileName`, {
              })(
                <Select size="default" placeholder="请选择" style={{ width: '100%' }}>
                {this.renderMp3File(this.state.MP3data)}
                </Select>
                )}
            </FormItem>
      )
      break;
    case "6":
      return (
        <FormItem {...formItemLayout} label={`音源通道`}>
              {getFieldDecorator(`ChannelSelect`, {
                initialValue: '0',
              })(
                <Select size="default" placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">线路一</Option>
                  <Option value="1">线路二</Option>
                  {/* <Option value="2">话筒</Option> */}
                  <Option value="3">MP3</Option>
                </Select>
                )}
            </FormItem>
      )
      break;
    }

  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
        labelCol: {
          xs: { span: 1 },
          sm: { span: 2 },
        },
        wrapperCol: {
          xs: { span: 7 },
          sm: { span: 7 },
        },
      };

      const formItemLayouteee = {
        labelCol: {
          xs: { span: 1 },
          sm: { span: 2 },
        },
        wrapperCol: {
          xs: { span: 17 },
          sm: { span: 17 },
        },
      };
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem
        {...formItemLayout}
         label="内容类型">
          {getFieldDecorator('contentType', {
          })(
          <RadioGroup onChange={this.onChange.bind(this)}>
            <RadioButton value="2">短 讯</RadioButton>
            <RadioButton value="3">网 络</RadioButton>
            <RadioButton value="5">文 件</RadioButton>
            <RadioButton value="6">设 备</RadioButton>
          </RadioGroup>
              )}
        </FormItem>
               {this.state.checkKey==="2"?<FormItem
                    label="重复次数"
                    {...formItemLayout}
                >
                    {getFieldDecorator(`RepeatTimes`, {
                     
                    })(
                        <InputNumber min={1} max={99}  />

                        )}
                </FormItem>:null}
                {this.state.checkKey==="2"?<FormItem
                    label="文字显示时长"
                    {...formItemLayout}
                >
                    {getFieldDecorator(`timeRange`, {
                        initialValue: 120,
                    })(
                        <InputNumber min={1} max={300}/>
                        )}
                </FormItem>:null}
                {this.state.checkKey==="2"?<FormItem
                    label="显示模式"
                    {...formItemLayout}
                >
                    {getFieldDecorator(`showMode`, {
                       
                    })(
                        <Select
                            onChange={this.handleSelectChange}
                        >
                            <Option value="1">TTS</Option>
                            <Option value="2">LED</Option>
                            <Option value="3">TTS/LED</Option>
                        </Select>
                        )}
                </FormItem>:null}
               
                {this.state.checkKey==="2"? <FormItem
                    label="短讯内容"
                    {...formItemLayout}
                >
                    {getFieldDecorator(`Txtcontent`, {
                        initialValue: '',
                    })(
                        <TextArea rows={4} />
                        )}
                </FormItem>:null}

        {this.renderOption(this.state.checkKey)}
      </Form>
    );
  }
}

export default contentForm