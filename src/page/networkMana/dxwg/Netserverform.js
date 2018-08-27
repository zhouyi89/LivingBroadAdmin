import React from 'react';
import { Form, Input, Select, Button } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

class Netserverform extends React.Component {
  state={
    ipaddrerror:""
  }
  componentDidMount(){
    this.props.store.subscribe(() => {
      this.setState({ ipaddrerror:""})
      const { deviceDATA } = this.props.store.getState();
      this.props.form.setFieldsValue({
        ebcServerAddr:deviceDATA.ebcServerAddr,   
        ebcServerPort:deviceDATA.ebcServerPort 
      });
    });

  }
  subDATA(){
    let DATA;
    if(this.state.ipaddrerror==="error"){
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
      this.setState({ipaddrerror:'error'})
    }
    else{
      this.setState({ipaddrerror:"success"})
    }
  }
  isValidIP(ip) {
    var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
    return reg.test(ip);
} 
  render() {
    let that=this;
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
              validateStatus={this.state.ipaddrerror}
              label="服务器地址">
                {getFieldDecorator('ebcServerAddr', {
                })(
                  <Input  onChange={this.ipchange.bind(that)}/>
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
      </Form>
    );
  }
}

export default Netserverform