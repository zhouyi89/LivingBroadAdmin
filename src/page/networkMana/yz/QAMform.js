import React from 'react';
import { Form, Input, Select, Button,Row, Col } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

class QAMform extends React.Component {
  componentDidMount(){
    this.props.store.subscribe(() => {
      const { deviceDATA } = this.props.store.getState();
      this.props.form.setFieldsValue({
        ebsTableId:deviceDATA.ebsTableId,   
        ebsControlFlowPid:deviceDATA.ebsControlFlowPid ,
        ebsTrafficFlowPid:deviceDATA.ebsTrafficFlowPid ,
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
        xs: { span: 8 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 12},
        sm: { span: 12 },
      },
    };
    return (
      <Form onSubmit={this.handleSubmit} >
        <Row>
        <Col span={8} >
              <FormItem
              {...formItemLayout}
              label="table_id">
                {getFieldDecorator('ebsTableId', {
                })(
                  <Input  />
                    )}
              </FormItem>
        </Col>
        <Col span={8} >
              <FormItem
              {...formItemLayout}
              label="控制流Pid">
                {getFieldDecorator('ebsControlFlowPid', {
                })(
                  <Input  />
                    )}
              </FormItem>
        </Col>
        <Col span={8} >
              <FormItem
              {...formItemLayout}
              label="业务流Pid">
                {getFieldDecorator('ebsTrafficFlowPid', {
                })(
                  <Input  />
                    )}
              </FormItem>
        </Col>
        </Row>

      </Form>
    );
  }
}

export default QAMform