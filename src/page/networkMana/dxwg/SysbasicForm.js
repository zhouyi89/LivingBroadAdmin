import React from 'react';
import { Form, Input, Select, Button} from 'antd';


const FormItem = Form.Item;
const Option = Select.Option;

class SysbasicForm extends React.Component {
  componentDidMount(){
        this.props.store.subscribe(() => {
        const { deviceDATA } = this.props.store.getState();
        this.props.form.setFieldsValue({
          sysName:deviceDATA.sysName,   
          sysObjectID:deviceDATA.sysObjectID,   
          sysUpTime:deviceDATA.sysUpTime,   
          sysDescr:deviceDATA.sysDescr,   
          sysContact:deviceDATA.sysContact,   
          sysLocation:deviceDATA.sysLocation,   
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
              label="名称">
                {getFieldDecorator('sysName', {
                })(
                  <Input  />
                    )}
              </FormItem>
              <FormItem
              {...formItemLayout}
              label="系统OID">
                {getFieldDecorator('sysObjectID', {
                })(
                  <Input  disabled/>
                    )}
              </FormItem>
              <FormItem
              {...formItemLayout}
              label="保持时间">
                {getFieldDecorator('sysUpTime', {
                })(
                  <Input disabled />
                    )}
              </FormItem>
              <FormItem
              {...formItemLayout}
              label="描述">
                {getFieldDecorator('sysDescr', {
                })(
                  <Input  />
                    )}
              </FormItem>
              <FormItem
              {...formItemLayout}
              label="联系人">
                {getFieldDecorator('sysContact', {
                })(
                  <Input  />
                    )}
              </FormItem>
              <FormItem
              {...formItemLayout}
              label="位置">
                {getFieldDecorator('sysLocation', {
                })(
                  <Input  />
                    )}
              </FormItem>
      </Form>
    );
  }
}

export default SysbasicForm