import React from 'react';
import { Form, Input, Button ,DatePicker} from 'antd';
import moment from 'moment';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
class opbroadform extends React.Component {
  handleChange = (e) => {
    this.setState({
      checkNick: e.target.checked,
    }, () => {
      this.props.form.validateFields(['nickname'], { force: true });
    });
  }
  handleSubmit= (e) =>{
    var that =this;
    e.preventDefault();
    let search = [];
    this.props.form.validateFields((err, values) => {
        if (err) {
            return;
          }
       let start=  values["timerange"][0].format('YYYY-MM-DD HH:mm:ss');
       let end=  values["timerange"][1].format('YYYY-MM-DD HH:mm:ss');
       search.push(start);
       search.push(end);
       const { store } = that.props;
       store.setState({ searchvalue: search,phonenum:values["phonenum"] });
     //  this.props.loadingfalse();
  });
}
  render() {
    const { getFieldDecorator } = this.props.form;
    const rangeConfig = {
        rules: [{ type: 'array', required: true, message: '请选择时间！' }],
      };
    return (
                <Form layout="inline" onSubmit={this.handleSubmit.bind(this)}>
                    <FormItem  label="电话号码">
                    {getFieldDecorator(`phonenum`, {
                        initialValue:'',
                    })(
                        <Input />
                    )}
                    </FormItem>
                    <FormItem  label="时间范围">
                    {getFieldDecorator(`timerange`,{
                        initialValue:[moment(Date.now()), moment(Date.now())],
                    })(
                     <RangePicker />
                    )}
                    </FormItem>
                    <FormItem style={{float: "right",marginRight:0}}>
                    <Button
                        type="primary"
                        htmlType="submit"
                    >
                        查 询
                    </Button>
                    </FormItem>
                </Form>
    );
  }
}

export default opbroadform