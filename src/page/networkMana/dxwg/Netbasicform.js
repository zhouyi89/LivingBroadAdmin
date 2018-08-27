import React from 'react';
import { Form, Input, Select, Button } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;


class Netbasicform extends React.Component {
  state={
    ipadderror:"",
    maskerror:"",
    gatewayerror:""
  }
  componentDidMount(){
    this.props.store.subscribe(() => {
      this.setState({    ipadderror:"",
      maskerror:"",
      gatewayerror:""})
      const { deviceDATA } = this.props.store.getState();
      this.props.form.setFieldsValue({
        lt2IpsIpAddress:deviceDATA.lt2IpsIpAddress,   
        lt2IpsMask:deviceDATA.lt2IpsMask,   
        lt2IpsDefaultGateway:deviceDATA.lt2IpsDefaultGateway,   
        lt2IpsPhysicalAddress:deviceDATA.lt2IpsPhysicalAddress,   
        ebcLogicalAddr:deviceDATA.ebcLogicalAddr,  
      });
    });

  }
  subDATA(){
    let DATA;
    if(this.state.ipadderror==="error"||this.state.gatewayerror==="error"){
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
  isValidIP(ip) {
    var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
    return reg.test(ip);
} 
ipchange(e){
  if(!this.isValidIP(e.target.value)){
    this.setState({ipadderror:'error'})
  }
  else{
    this.setState({ipadderror:"success"})
  }
}
gatewaychange(e){
  if(!this.isValidIP(e.target.value)){
    this.setState({gatewayerror:'error'})
  }
  else{
    this.setState({gatewayerror:"success"})
  }
}
logicchange(e){
  // if(!this.isValidIP(e.target.value)){
  //   this.setState({gatewayerror:'error'})
  // }
  // else{
  //   this.setState({gatewayerror:"success"})
  // }
}
  render() {
    let that =this;
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
               validateStatus={this.state.ipadderror}
              label="IP地址">
                {getFieldDecorator('lt2IpsIpAddress', {
                }
                )(
                  <Input  onChange={this.ipchange.bind(that)}/>
                    )}
              </FormItem>
              <FormItem
              {...formItemLayout}
              hasFeedback
               validateStatus={this.state.maskerror}
              label="子网掩码">
                {getFieldDecorator('lt2IpsMask', {
                })(
                  <Input  />
                    )}
              </FormItem>
              <FormItem
              {...formItemLayout}
              hasFeedback
              validateStatus={this.state.gatewayerror}
              label="默认网关">
                {getFieldDecorator('lt2IpsDefaultGateway', {
                })(
                  <Input  onChange={this.gatewaychange.bind(that)}/>
                    )}
              </FormItem>
              <FormItem
              {...formItemLayout}
              label="MAC地址">
                {getFieldDecorator('lt2IpsPhysicalAddress', {
                })(
                  <Input  disabled/>
                    )}
              </FormItem>
              <FormItem
              {...formItemLayout}
              label="逻辑地址">
                {getFieldDecorator('ebcLogicalAddr', {
                })(
                  <Input  onChange={this.logicchange.bind(that)}/>
                    )}
              </FormItem>
      </Form>
    );
  }
}

export default Netbasicform