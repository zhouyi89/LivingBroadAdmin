import React from 'react';
import { Form, Input, Select, Button } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

class Netsoftinfo extends React.Component {

  componentDidMount(){
    this.props.store.subscribe(() => {
      const { deviceDATA } = this.props.store.getState();
      this.props.form.setFieldsValue({
        ebcSoftVersion:deviceDATA.ebcSoftVersion,   
        ebcHardVersion:deviceDATA.ebcHardVersion,   
        ebcManufacturer:deviceDATA.ebcManufacturer,   
        ebcModelNumber:deviceDATA.ebcModelNumber,   
        ebcSerialNo:deviceDATA.ebcSerialNo,   
        ebcDescription:deviceDATA.ebcDescription,   
      });
    });

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
              label="软件版本号">
                {getFieldDecorator('ebcSoftVersion', {
                })(
                  <Input  disabled/>
                    )}
              </FormItem>
              <FormItem
              {...formItemLayout}
              label="硬件版本号">
                {getFieldDecorator('ebcHardVersion', {
                })(
                  <Input  disabled/>
                    )}
              </FormItem>
              <FormItem
              {...formItemLayout}
              label="生产商">
                {getFieldDecorator('ebcManufacturer', {
                })(
                  <Input  disabled/>
                    )}
              </FormItem>
              <FormItem
              {...formItemLayout}
              label="型号">
                {getFieldDecorator('ebcModelNumber', {
                })(
                  <Input  disabled/>
                    )}
              </FormItem>
              <FormItem
              {...formItemLayout}
              label="序列号">
                {getFieldDecorator('ebcSerialNo', {
                })(
                  <Input  disabled/>
                    )}
              </FormItem>
              <FormItem
              {...formItemLayout}
              label="描述">
                {getFieldDecorator('ebcDescription', {
                })(
                  <Input  disabled/>
                    )}
              </FormItem>
      </Form>
    );
  }
}

export default Netsoftinfo