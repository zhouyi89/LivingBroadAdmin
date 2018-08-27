import React from 'react';
import { Form, Input, Select, Button } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

class Basicinfoyzform extends React.Component {
  componentDidMount(){
    this.props.store.subscribe(() => {
      const { deviceDATA } = this.props.store.getState();
      this.props.form.setFieldsValue({
        ebcCurrentVolume:deviceDATA.ebcCurrentVolume,   
        ebcTemp:deviceDATA.ebcTemp ,
        ebcDCvoltage:deviceDATA.ebcDCvoltage ,
      });
    });

  }
  subDATA(){
    let DATA;
    this.props.form.validateFields((err, values) => {
        DATA= values
        // console.log("values",values)

    })
    return DATA;
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
              label="当前音量">
                {getFieldDecorator('ebcCurrentVolume', {
                })(
                  <Input  disabled/>
                    )}
              </FormItem>
              <FormItem
              {...formItemLayout}
              label="环境温度">
                {getFieldDecorator('ebcTemp', {
                })(
                  <Input  disabled/>
                    )}
              </FormItem>
              <FormItem
              {...formItemLayout}
              label="直流电压">
                {getFieldDecorator('ebcDCvoltage', {
                })(
                  <Input  disabled/>
                    )}
              </FormItem>  
      </Form>
    );
  }
}

export default Basicinfoyzform