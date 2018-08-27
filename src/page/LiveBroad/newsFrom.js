import React from 'react';
import { Form, Input,Select,InputNumber } from 'antd';
const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
class newsFrom extends React.Component {
    getnewFromdata(){
        let vv;
        this.props.form.validateFields((err, values) => {
            if (err) {
                return;
            }
            vv=  values;
        });
        return vv;
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const rangeConfig = {
            rules: [{ type: 'array', required: true, message: '请选择时间！' }],
        };
        return (


            <Form >
                <FormItem
                    label="重复次数"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 15 }}
                >
                    {getFieldDecorator(`RepeatTimes`, {
                        initialValue: 1,
                    })(
                        <InputNumber min={1} max={99}  />

                        )}
                </FormItem>
                <FormItem
                    label="文字显示时长"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 15 }}
                >
                    {getFieldDecorator(`timeRange`, {
                        initialValue: 120,
                    })(
                        <InputNumber min={1} max={300}/>
                        )}
                </FormItem>
                <FormItem
                    label="显示模式"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 15 }}
                >
                    {getFieldDecorator(`showMode`, {
                        initialValue: '1',
                    })(
                        <Select
                            onChange={this.handleSelectChange}
                        >
                            <Option value="1">TTS</Option>
                            <Option value="2">LED</Option>
                            <Option value="3">TTS/LED</Option>
                        </Select>
                        )}
                </FormItem>
                <FormItem
                    label="短讯内容"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 15 }}
                >
                    {getFieldDecorator(`Txtcontent`, {
                        initialValue: '',
                    })(
                        <TextArea rows={4} />
                        )}
                </FormItem>
            </Form>





        );
    }
}

export default newsFrom