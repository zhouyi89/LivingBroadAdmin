import React from 'react';
import { Form, Input, Select, Button } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

class Netserveryzform extends React.Component {
  state={
    servererror:"",
    pushservererror:"",
    audioservererror:""
  }
  componentDidMount(){
    this.props.store.subscribe(() => {
      this.setState({    servererror:"",
      pushservererror:"",
      audioservererror:""})
      const { deviceDATA } = this.props.store.getState();
      this.props.form.setFieldsValue({
        ebcServerAddr:deviceDATA.ebcServerAddr,   
        ebcServerPort:deviceDATA.ebcServerPort,
        ebcPushServerAddr:deviceDATA.ebcPushServerAddr,   
        ebcPushServerPort:deviceDATA.ebcPushServerPort ,
        ebcAudioServerAddr:deviceDATA.ebcAudioServerAddr,   
        ebcAudioServerPort:deviceDATA.ebcAudioServerPort  
      });
    });

  }
  subDATA(){
    let DATA;
    if(this.state.servererror==="error"||this.state.pushservererror==="error"||this.state.audioservererror==="error"){
      return "error"
    }
    else{
          this.props.form.validateFields((err, values) => {
        DATA= values
        // console.log("values",values)

    })
    return DATA;
    }
  }
  ipchange(e){
    if(!this.isValidIP(e.target.value)){
      this.setState({servererror:'error'})
    }
    else{
      this.setState({servererror:"success"})
    }
  }
  pushchange(e){
    if(!this.isValidIP(e.target.value)){
      this.setState({pushservererror:'error'})
    }
    else{
      this.setState({pushservererror:"success"})
    }
  }
  audiochange(e){
    if(!this.isValidIP(e.target.value)){
      this.setState({audioservererror:'error'})
    }
    else{
      this.setState({audioservererror:"success"})
    }
  }
  isValidIP(ip) {
    var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
    return reg.test(ip);
} 
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
        labelCol: {
          xs: { span: 3 },
          sm: { span: 3 },
        },
        wrapperCol: {
          xs: { span: 8},
          sm: { span: 8 },
        },
      };

    return (
      <Form onSubmit={this.handleSubmit}>
              <FormItem
              {...formItemLayout}
              hasFeedback
              validateStatus={this.state.servererror}
              label="服务器地址">
                {getFieldDecorator('ebcServerAddr', {
                })(
                  <Input   onChange={this.ipchange.bind(this)}/>
                    )}
              </FormItem>
              <FormItem
              {...formItemLayout}
              label="服务器端口">
                {getFieldDecorator('ebcServerPort', {
                })(
                  <Input  />
                    )}
              </FormItem>       
              <FormItem
              {...formItemLayout}
              hasFeedback
              validateStatus={this.state.pushservererror}
              label="推送服务器IP地址">
                {getFieldDecorator('ebcPushServerAddr', {
                })(
                  <Input  onChange={this.pushchange.bind(this)}/>
                    )}
              </FormItem>
              <FormItem
              {...formItemLayout}
              label="推送服务器端口">
                {getFieldDecorator('ebcPushServerPort', {
                })(
                  <Input  />
                    )}
              </FormItem>      
              <FormItem
              {...formItemLayout}
              hasFeedback
              validateStatus={this.state.audioservererror}
              label="音频服务器IP地址">
                {getFieldDecorator('ebcAudioServerAddr', {
                })(
                  <Input  onChange={this.audiochange.bind(this)}/>
                    )}
              </FormItem>
              <FormItem
              {...formItemLayout}
              label="音频服务器端口">
                {getFieldDecorator('ebcAudioServerPort', {
                })(
                  <Input  />
                    )}
              </FormItem>    
      </Form>
    );
  }
}

export default Netserveryzform