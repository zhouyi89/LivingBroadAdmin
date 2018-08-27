import React from 'react';
import { Form, Input, Select, Button} from 'antd';


const FormItem = Form.Item;
const Option = Select.Option;

class BasicinfoForm extends React.Component {
  componentDidMount(){
        this.props.store.subscribe(() => {
        const { deviceDATA } = this.props.store.getState();
        this.props.form.setFieldsValue({
          DLevel:deviceDATA.DLevel,   
          ELevel:deviceDATA.ELevel,   
          SamplingRate:deviceDATA.SamplingRate,   
          TalkTime:deviceDATA.TalkTime,   
          LoginPw:deviceDATA.LoginPw,   
          BroadcastPw:deviceDATA.BroadcastPw,   
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
              label="日常广播级别">
                {getFieldDecorator('DLevel', {
                })(
                  <Input  />
                    )}
              </FormItem>
              <FormItem
              {...formItemLayout}
              label="应急广播级别">
                {getFieldDecorator('ELevel', {
                })(
                  <Input />
                    )}
              </FormItem>
              <FormItem
              {...formItemLayout}
              label="采样率码率">
                {getFieldDecorator('SamplingRate', {
                })(
                  <Input  />
                    )}
              </FormItem>
              <FormItem
              {...formItemLayout}
              label="最大通话时长">
                {getFieldDecorator('TalkTime', {
                })(
                  <Input  />
                    )}
              </FormItem>
              <FormItem
              {...formItemLayout}
              label="登录密码">
                {getFieldDecorator('LoginPw', {
                })(
                  <Input  />
                    )}
              </FormItem>
              <FormItem
              {...formItemLayout}
              label="播出密码">
                {getFieldDecorator('BroadcastPw', {
                })(
                  <Input  />
                    )}
              </FormItem>
      </Form>
    );
  }
}

export default BasicinfoForm